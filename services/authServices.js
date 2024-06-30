/**
 * @author Brandon Jared Molina Vazquez
 * @date 02/10/2023
 * @file This module is to handle user authentication.
 * @module authSchema
 */

const { Auth } = require('../models/auth');
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

    async getAuthByUser(id) {
        return Auth.findOne({ user_id: id });
    };

    /**
     * Gets a user's email.
     * @async
     * @function
     * @param {string} email - User email.
     * @returns {Promise<Array>} A Promise that will resolve to the user's credentials.
     */

    async getAuthByEmail(email) {
        return Auth.findOne({ email: email });
    };

    /**
     * Updates a user's credentials by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @param {Object} auth_data - New credential data.
     * @param {string} auth_data.email - New email for the user.
     * @param {string} auth_data.password - New password for the user.
     * @returns {Promise<void>} A Promise that will be resolved once the credentials update is complete.
     */

    async updateAuth(id, auth_data) {
        let { email, new_password, old_password } = auth_data;
        const user = await Auth.findOne({ user_id: id });

        if (bcrypt.compareSync(old_password, user["password"])) {
            new_password = await bcrypt.hash(new_password, 10);

        } else {
            throw Error('Incorrect');
        }

        return Auth.findOneAndUpdate(
            {
                user_id: id
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
            const data = jwt.verify(token.substring(7), process.env.SECRET_KEY);

            return {
                start: data["iat"],
                end: data["exp"],
                expired: false
            }

        } catch (err) {
            if (err["name"] === "TokenExpiredError") {
                return {
                    start: null,
                    end: null,
                    expired: true
                };

            } else {
                throw err;
            }
        }
    };
    
    async refreshToken(dataSession) {
        try {
            if (dataSession) {
                const details = await this.detailToken(dataSession);

                if (details["expired"]) {
                    const tokenDecrypted = jwt.decode(dataSession.substring(7), process.env.SECRET_KEY);
                    const newToken = jwt.sign({
                            user_id: tokenDecrypted["user_id"],
                            role: tokenDecrypted["role"]
                        }, process.env.SECRET_KEY,
                        {expiresIn: process.env.EXPIRE});
                    const newTokenDecrypted = jwt.decode(newToken, process.env.SECRET_KEY);

                    return [200, {
                        token: newToken,
                        role: tokenDecrypted["role"],
                        details: {
                            start: newTokenDecrypted["iat"],
                            end: newTokenDecrypted["exp"]
                        }
                    }];

                } else {
                    return [200, "Your session is still active 🏋️‍♂️"];
                }

            } else {
                return [];
            }
            
        } catch (err) {
            throw err;
        }
    }
}

module.exports = {AuthServices};
