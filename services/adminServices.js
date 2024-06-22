const {Admin} = require('../models/administrator');
const {Auth} = require("../models/auth");
const {User} = require("../models/user");
const {Request, Rescuer} = require("../models/rescuer");
const {Association} = require("../models/association");
const {connection} = require("../configurations/connections");
const {RescuerServices} = require("./rescuerServices");
const {UserServices} = require("../services/userServices");


class AdminServices {

    constructor() {
        this.rescuer = new RescuerServices();
        this.users = new UserServices();
    }

    async setAdmin(admin_data) {
        const {name, lastname, email, password} = admin_data;
        const session = await connection.startSession();
        let output_admin, output_auth;

        await session.withTransaction(async () => {
            await Admin.create([
                {
                    name: name,
                    lastname: lastname
                }
            ], {session})
                .then((admin) => {
                    output_admin = admin[0];
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user_id: output_admin["_id"],
                    role: ["ADMINISTRATOR"],
                    doc_model: "Admin"
                }
            ], {session})
                .then((auth) => {
                    output_auth = auth[0];
                });

            await Admin.updateOne(
                {
                    _id: output_admin["_id"]
                },
                {
                    $set: {
                        auth_id: output_auth["_id"]
                    }
                },
                {session}
            );
        })

        await session.endSession();
        return output_admin;
    }

    async getAdmin(id) {
        return Admin.findById(id)
            .populate(
                "auth_id", {email: 1, password: 1, _id: 0}
            );
    }

    async updateAdmin(id, admin_data) {
        return Admin.findByIdAndUpdate(id, {$set: admin_data}, {runValidators: true, new: true});
    }

    async deleteAdmin(id) {
        const session = await connection.startSession();

        await session.withTransaction(async () => {
            await Auth.deleteOne({user_id: id}, {session});
            await Admin.deleteOne({_id: id}, {session});
        });
        await session.endSession();
    }

    async getRequestById(id) {
        return Request.findById({_id: id});
    }

    async getRequestByUser(id) {
        return Request.findOne({user_id: id});
    }

    async getRequests() {
        return Request.find({}).populate("user_id", {posts_id: 0, bulletins_id: 0, auth_id: 0});
    }

    async deleteRequest(request_id) {
        const session = await connection.startSession();
        const request = await Request.findById(request_id);

        await session.withTransaction(async () => {
            if (request["role"][0] === "RESCUER") {
                await Promise.all([
                    Request.deleteOne({_id: request_id}, {session}),
                    this.rescuer.deleteRescuer(request["user"])
                ]);

            } else {
                await Request.deleteOne({_id: request_id}, {session});
            }
        });

        await session.endSession();
    }

    async activateRequest(id) {
        const session = await connection.startSession();
        const request = await Request.findById(id);
        let output_request;


        if (request["requester_role"][0] === "USER") {

            await session.withTransaction(async () => {
                const user_data = await User.findById(request["user_id"]["_id"]);
                await User.deleteOne({_id: user_data["_id"]}, {session});

                if (request["requested_role"] === "RESCUER") {
                    await Rescuer.create([
                        {
                            _id: user_data["_id"],
                            name: user_data["name"],
                            social_networks: user_data["social_networks"],
                            posts_id: user_data["posts_id"],
                            auth_id: user_data["auth_id"]
                        }
                    ], {session});

                    await Request.findByIdAndUpdate(id,
                        {
                            $set: {
                                status: "active",
                                doc_model: "Rescuer"
                            }
                        },
                        {
                            new: true
                        }
                    ).session(session)
                        .then((request) => {
                            output_request = request;
                        });

                    await Auth.findOneAndUpdate(
                        {
                            user_id: request["user_id"]
                        },
                        {
                            $set: {
                                role: ["RESCUER", "USER"],
                                doc_model: "Rescuer"
                            }
                        },
                        {session}
                    );
                }
                else if (request["requested_role"] === "ASSOCIATION") {
                    await Association.create([
                        {
                            _id: user_data["_id"],
                            name: user_data["name"],
                            social_networks: user_data["social_networks"],
                            posts_id: user_data["posts_id"],
                            auth_id: user_data["auth_id"]
                        }
                    ], {session});

                    await Request.findByIdAndUpdate(id,
                        {
                            $set: {
                                status: "active",
                                doc_model: "Association"
                            }
                        },
                        {
                            new: true
                        }
                    ).session(session)
                        .then((request) => {
                            output_request = request;
                        });

                    await Auth.findOneAndUpdate(
                        {
                            user_id: request["user_id"]
                        },
                        {
                            $set: {
                                role: ["ASSOCIATION", "RESCUER", "USER"],
                                doc_model: "Association"
                            }
                        },
                        {session}
                    );
                }
            })

            await session.endSession();
            return output_request;

        } else {
            return Request.findByIdAndUpdate(id, {$set: {status: "active"}}, {new: true});
        }
    }

    async deactivateRequest(id) {
        return Request.findByIdAndUpdate(id, {$set: {status: "disabled"}}, {new: true});
    }

    async rejectRequest(id) {
        return Request.findByIdAndUpdate(id, {$set: {status: "rejected"}}, {new: true});
    }

    async filterRequests(filter) {
        return Request.find({status: filter});
    }

    async getRescuers() {
        return await this.rescuer.getRescuers();
    }

    async getRescuer(rescuer_id) {
        return await this.rescuer.getRescuer(rescuer_id);
    }

    async deleteRescuer(rescuer_id) {
        await this.rescuer.deleteRescuer(rescuer_id);
    }

    async getUsers() {
        return await this.users.getUsers();
    }

    async getUser(user_id) {
        return await this.users.getUser(user_id);
    }

    async deleteUser(user_id) {
        await this.users.deleteUser(user_id);
    }
}

module.exports = {AdminServices};
