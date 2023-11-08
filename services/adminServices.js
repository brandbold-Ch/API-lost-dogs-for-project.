const Admin = require('../models/administrator');
const Auth = require("../models/auth");
const {User} = require("../models/user");

class AdminServices {
    constructor() {};

    async create(data) {
        const { name, lastname, cellphone, email, password, birthdate, age, address } = data;

        const admin = new Admin(
            {
                name,
                lastname,
                cellphone,
                email,
                details: {
                    birthdate: birthdate,
                    age: age,
                    address: address
                }
            }
        );
        const auth = new Auth({email, password, user: admin._id, role: 'ADMINISTRATOR'});

        await admin.save();
        await auth.save();
    }

    async getAdmin(id) {
        return Admin.findOne(
            {
                _id: id
            },
            {
                __v:0,
                _id: 0
            }
        );
    }
}

module.exports = AdminServices;
