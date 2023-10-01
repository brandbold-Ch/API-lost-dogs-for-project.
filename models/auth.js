/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module is responsible for creating a credential model for users.
 * @module authSchema
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

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
            message: 'Invalid email field'
        }
    },
    password: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

/**
 * Mongodb middleware to encrypt the password before saving it to the database.
 * @function
 * @name preSaveMiddleware
 * @returns {void}
 * @throws {error} - Error in case there is a problem encrypting the password.
 */

authSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();

    } catch (error) {
        next(error);
    }
})

/**
 * Mongoose model for user credentials.
 * @type {mongoose.Model<AuthSchema>}
 */

const Auth = mongoose.model('auth', authSchema)
module.exports = Auth;
