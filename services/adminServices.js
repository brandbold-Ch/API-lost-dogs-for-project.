const {Admin} = require('../models/administrator');
const {Auth} = require("../models/auth");
const {Request} = require("../models/rescuer");
const {connection} = require("../configurations/connections");
const {RescuerServices} = require("./rescuerServices");
const {UserServices} = require("../services/userServices");


class AdminServices {

    constructor() {
        this.rescuer = new RescuerServices();
        this.users = new UserServices();
    }

    async setAdmin(data) {
        const {name, lastname, email, password} = data;
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
                    user: output_admin["_id"],
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
                        auth: output_auth["_id"]
                    }
                },
                {session}
            );
        })
        await session.endSession();

        return output_admin;
    }

    async getAdmin(id) {
        return Admin.findById(id).populate("auth", {email: 1, password: 1, _id: 0});
    }

    async updateAdmin(id, data) {
        return Admin.findByIdAndUpdate(id, {$set: data}, {runValidators: true, new: true});
    }

    async deleteAdmin(id) {
        const session = await connection.startSession();

        await session.withTransaction(async () => {
            await Auth.deleteOne({user: id}, {session});
            await Admin.deleteOne({_id: id}, {session});
        });
        await session.endSession();
    }

    async getRequestById(id) {
        return Request.findById({_id: id});
    }

    async getRequestByUser(id) {
        return Request.findOne({user: id});
    }

    async getRequests() {
        return Request.find({}).populate("user", {posts: 0, bulletins: 0, auth: 0});
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

        if ((request["role"].length <= 1) && (request["role"][0] === "USER")) {

            await session.withTransaction(async () => {

                await Request.findByIdAndUpdate(id,
                    {
                        $set: {
                            status: "active"
                        },
                        $push: {
                            role: "RESCUER"
                        }
                    },
                    {
                        new: true
                    },
                    {session}
                )
                    .then((request) => {
                        output_request = request;
                    });

                await Auth.findOneAndUpdate(
                    {
                        user: request["user"]
                    },
                    {
                        $push: {
                            role: "RESCUER"
                        }
                    },
                    {session}
                )
            });

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
        return Request.find({status: filter})
    }

    async getRescuers() {
        return await this.rescuer.getRescuers();
    }

    async getRescuer(collab_id) {
        return await this.rescuer.getRescuer(collab_id);
    }

    async deleteRescuer(collab_id) {
        await this.rescuer.deleteRescuer(collab_id);
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
