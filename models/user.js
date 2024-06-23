/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module is responsible for creating the user model.
 * @module authSchema
 */

const { baseUserModel } = require("./baseUser");
const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Mongoose schema for the user model.
 * @type {mongoose.Schema}
 */

const userModel = new Schema({
    ...baseUserModel.obj,
    lastname: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: false,
        default: null,
        maxLength: 10,
        minLength: 10
    }
}, {
    versionKey: false
})

const User = mongoose.model("User", userModel);
module.exports = { User }
