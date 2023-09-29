const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dogSchema = require('./dogs');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    cellphone: {
        type: String,
        required: true,
        unique: true,
        maxLength: 10,
        minLength: 10
    },
    lost_dogs: [dogSchema]
})

const User = mongoose.model('user', userSchema);

module.exports = User;