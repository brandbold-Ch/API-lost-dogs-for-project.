const Admin = require('../models/administrator');
const Auth = require("../models/auth");

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

    async updateAdmin(id, data) {
        const template = {
            name: data.name,
            lastname: data.lastname,
            cellphone: data.cellphone,
            details: {
                birthdate: data.birthdate,
                age: data.age,
                address: data.address
            }
        }
        await Admin.updateOne(
            {
                _id: id
            },
            {
                $set: template
            },
            {
                runValidators: true
            }
        );
    }
}

module.exports = AdminServices;
