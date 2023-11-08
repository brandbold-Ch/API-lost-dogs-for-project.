const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { userSchema } = require('./user');

const { name, lastname, cellphone, email } = userSchema.obj;

const adminSchema = new Schema({
    name,
    lastname,
    cellphone,
    email,
    details: {
        birthdate: {
            type: Date,
            required: true
        },
        age: {
            type: mongoose.Schema.Types.Number,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
