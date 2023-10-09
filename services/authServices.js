const Auth = require('../models/auth');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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

    async generateTokenUser(payload) {
         return jwt.sign(payload, 'my-secret-key', {expiresIn: '2h'});
    };
}

module.exports = AuthServices;