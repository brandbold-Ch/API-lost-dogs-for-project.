/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module is responsible for creating the user model.
 * @module authSchema
 */


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dogSchema = require('./dogs');

/**
 * Scheme to store information about a user.
 * @typedef {Object} UserSchema
 * @property {string} name - Name of the user.
 * @property {string} lastname - Last name of the user.
 * @property {string} cellphone - User's phone number.
 * @property {Array} lost_dogs - Array that stores lost dogs associated with the user.
 */

/**
 * Mongoose schema for the user model.
 * @type {mongoose.Schema}
 */

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

/**
 * Mongoose model for the user model.
 * @type {mongoose.Model<UserSchema>}
 */

const User = mongoose.model('user', userSchema);
module.exports = User;
