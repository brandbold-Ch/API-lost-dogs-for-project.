/**
 * @author Brandon Jared Molina Vazquez
 * @date 02/10/2023
 * @file This module is to handle user authentication.
 * @module authSchema
 */

const {Auth} = require('../models/auth');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();


class AuthServices {

    constructor() {
    }

    /**
     * Gets a user's credentials by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise<Array>} A Promise that will resolve to the user's credentials.
     */

    async getAuth(id) {
        return Auth.findOne(
            {
                user: id
            },
            {
                doc_model: 0,
                user: 0,
                _id: 0
            }
        );
    };

    /**
     * Gets a user's email.
     * @async
     * @function
     * @param {string} email - User email.
     * @returns {Promise<Array>} A Promise that will resolve to the user's credentials.
     */

    async entityExists(email) {
        return Auth.findOne({email: email});
    };

    async getUser(user) {
        return Auth.findOne({user: user});
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

    async updateAuth(id, data) {
        let {email, new_password, old_password} = data;
        const user = await Auth.findOne({user: id});

        if (bcrypt.compareSync(old_password, user.password)) {
            new_password = await bcrypt.hash(new_password, 10);
        } else {
            throw Error('Incorrect password 🤬');
        }

        return Auth.findOneAndUpdate(
            {
                user: id
            },
            {
                $set: {
                    email: email,
                    password: new_password
                }
            },
            {
                runValidators: true,
                new: true
            }
        );
    };

    async detailToken(token) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY);
            return {
                start: data.iat,
                end: data.exp,
                expired: false
            }

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return {
                    start: null,
                    end: null,
                    expired: true
                };
            } else {
                return error;
            }
        }
    };
}

module.exports = {AuthServices};
