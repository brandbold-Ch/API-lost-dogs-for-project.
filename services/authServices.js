/**
 * @author Brandon Jared Molina Vazquez
 * @date 02/10/2023
 * @file This module is to handle user authentication.
 * @module authSchema
 */


const Auth = require('../models/auth');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthServices {
    constructor() {};

    /**
     * Gets a user's credentials by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise<Array>} A Promise that will resolve to the user's credentials.
     */

    async getCredentials(id){
        return Auth.findOne({user: id}, {user: 0, _id: 0, __v:0});
    };

    /**
     * Gets a user's email.
     * @async
     * @function
     * @param {string} email - User email.
     * @returns {Promise<Array>} A Promise that will resolve to the user's credentials.
     */

    async getEmail(email) {
        return Auth.findOne({email: email});
    };

    /**
     * Updates a user's credentials by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @param {Object} data - New credential data.
     * @param {string} data.email - New email for the user.
     * @param {string} data.password - New password for the user.
     * @returns {Promise<void>} A Promise that will be resolved once the credentials update is complete.
     */

    async updateCredentials(id, data) {
        let { email, password } = data;
        password = await bcrypt.hash(password, 10);
        await User.updateOne({_id: id}, {$set: {email: email}});
        await Auth.updateOne(
            {user: id},
            {$set: {email: email, password: password}},
            {runValidators: true}
        );
    };

    /**
     * Generates a JSON Web Token (JWT) for a user based on the provided payload.
     *
     * @async
     * @function
     * @param {Object} payload - The data to be included in the JWT payload.
     * @param {string} payload.email - The user's email.
     * @param {string} payload.user - The user identifier.
     * @returns {Promise<string>} A Promise that resolves to the generated JWT.
     * @throws {Error} If there's an issue during token generation.
     */

    async generateTokenUser(payload) {
         return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '3h'});
    };
}

module.exports = AuthServices;