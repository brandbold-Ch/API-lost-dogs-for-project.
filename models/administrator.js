const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const adminSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
