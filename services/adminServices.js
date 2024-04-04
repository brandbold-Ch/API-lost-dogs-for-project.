
const Admin = require('../models/administrator');
const Auth = require("../models/auth");
const Request = require("../models/request");
const { conn } = require("../configurations/connections");
const CollabServices = require("../services/collabServices");
const UsersServices = require("../services/userServices");


class AdminServices {

    constructor() {
        this.collabs = new CollabServices();
        this.users = new UsersServices();
    };

    async createAdmin(data) {
        const { name, lastname, email, password } = data;
        const session = await conn.startSession();
        let output_data;

        await session.withTransaction(async () => {
            await Admin.create([
                {
                    name: name,
                    lastname: lastname
                }
            ], { session })
                .then((admin) => {
                    output_data = admin;
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user: output_data[0]["_id"],
                    role: "ADMINISTRATOR"
                }
            ], { session });
        });
        await session.endSession();
    }

    async getAdmin(id) {
        return Admin.findById(id, { _id: 0 });
    }

    async updateAdmin(id, data) {
        await Admin.findByIdAndUpdate(id, { $set: data  }, { runValidators: true });
    }

    async deleteAdmin(id) {
        const session = await conn.startSession();

        await session.withTransaction(async () => {
            await Auth.deleteOne({ user: id }, { session });
            await Admin.deleteOne({ _id: id }, { session });
        });
        await session.endSession();
    }

    async getRequestForMiddlewareCheck(id) {
        return Request.findOne({ _id: id });
    }

    async getRequestForMiddlewareIsActive(id) {
        return Request.findOne({ user: id });
    }

    async getRequests(){
        return Request.find({}).populate("user", { _id: 0 });
    }

    async deleteRequest(request_id) {
        const session = await conn.startSession();
        const request = await Request.findById(request_id);

        await session.withTransaction(async () => {
            await Promise.all([
                Request.deleteOne({ _id: request_id }, { session }),
                this.collabs.deleteCollab(request["user"])
            ])
        });
        await session.endSession();
    }

    async activateRequest(id) {
        await Request.findByIdAndUpdate(id, { $set: { status: "active" }});
    }

    async deactivateRequest(id) {
        await Request.findByIdAndUpdate(id, { $set: { status: "disabled" }});
    }

    async rejectRequest(id) {
        await Request.findByIdAndUpdate(id, { $set: { status: "rejected" }});
    }

    async filterRequests(filter) {
        return Request.find({ status: filter }).populate("user", { _id: 0 });
    }

    async getCollabs() {
        return await this.collabs.getCollabs();
    }

    async getCollab(collab_id) {
        return await this.collabs.getCollab(collab_id);
    }

    async deleteCollab(collab_id) {
        await this.collabs.deleteCollab(collab_id);
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

module.exports = AdminServices;
