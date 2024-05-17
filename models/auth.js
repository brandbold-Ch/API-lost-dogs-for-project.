/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module is responsible for creating a credential model for users.
 * @module authSchema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

/**
 * Scheme to store a user's credentials.
 * @typedef {Object} AuthSchema
 * @property {string} email - User email.
 * @property {string} password - User password (saved encrypted).
 * @property {mongoose.Types.ObjectId} user - ID of the user to whom these credentials belong.
 */

/**
 * @classdesc Mongoose model for user credentials.
 * @class
 * @param {AuthSchema} authData - User credentials data.
 */

const authSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
            },
            message: "Invalid email field"
        }
    },
    password: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        refPath: "doc_model",
        required: true
    },
    role: [{
        type: String,
        required: true,
        enum: [
            "USER",
            "RESCUER",
            "ADMINISTRATOR"
        ],
        validate: {
            validator: function (role) {
                if (this.role.length <= 2) {
                    return role
                }
            }
        }
    }],
    doc_model: {
        type: String,
        required: true,
        enum: [
            "User",
            "Admin",
            "Rescuer"
        ]
    }
}, {
    versionKey: false
});

/**
 * Mongodb middleware to encrypt the password before saving it to the database.
 * @function
 * @name preSaveMiddleware
 * @returns {void}
 * @throws {error} - Error in case there is a problem encrypting the password.
 */

authSchema.pre("save", async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();

    } catch (err) {
        next(err);
    }
});

/**
 * Mongoose model for user credentials.
 * @type {mongoose.Model<AuthSchema>}
 */

authSchema.index({user: 1}, {unique: true});

const Auth = mongoose.model("Auth", authSchema);
module.exports = {Auth}
