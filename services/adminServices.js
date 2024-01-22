const Admin = require('../models/administrator');
const Auth = require("../models/auth");
const Request = require("../models/requests");

class AdminServices {
    constructor() {};

    async create(data) {
        const { name, lastname, email, password } = data;

        const admin = new Admin({ name, lastname });
        const auth = new Auth({email, password, user: admin['_id'], role: 'ADMINISTRATOR'});

        await auth.save();
        await admin.save();
    }

    async getAdmin(id) {
        return Admin.findById(id,
            { __v:0, _id: 0 }
        );
    }

    async updateAdmin(id, data) {
        await Admin.findByIdAndUpdate(id,
            { $set: { name: data.name, lastname: data.lastname}  },
            { runValidators: true }
        );
    }

    async delAdmin(id) {
        await Auth.deleteOne({ user: id });
        await Admin.deleteOne({ _id: id });
    }

    async getRequestForMiddlewareCheck(id) {
        return Request.findOne({ _id: id });
    }

    async getRequestForMiddlewareIsActive(id) {
        return Request.findOne({ user: id });
    }

    async getRequests(){
        return Request.find({}, { __v: 0}).populate('user', { __v: 0, _id: 0 });
    }

    async activateRequest(id) {
        await Request.findByIdAndUpdate(id, {$set: { status: 'activo' }});
    }

    async deactivateRequest(id) {
        await Request.findByIdAndUpdate(id, {$set: { status: 'inactivo' }});
    }

    async rejectRequest(id) {
        await Request.findByIdAndUpdate(id, {$set: { status: 'rechazado' }});
    }

    async filterRequests(filter) {
        return Request.find({ status: filter }, { __v: 0 }).populate('user', { __v: 0, _id: 0 });
    }
}

module.exports = AdminServices;
