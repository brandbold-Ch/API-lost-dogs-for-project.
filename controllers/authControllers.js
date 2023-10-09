/**
 * @author Brandon Jared Molina Vazquez
 * @date 04/10/2023
 * @file This module is for creating auth services.
 */

const authService = require('../services/authServices');
const service = new authService();
const bcrypt = require('bcrypt');

/**
 * Get user credentials (email and password)
 * @async
 * @function
 * @param {string} id - ID user
 * @returns {Promise<Array>}
 * */

exports.getCredentials = async (id) => {
    return await service.getCredentials(id);
};

/**
 * Update partial credentials (email or password)
 * @async
 * @function
 * @param {string} id - ID user
 * @param {Object} data - Body request data
 * @returns {Promise<void>}
 * */

exports.updateCredentials = async (id, data) => {
    await service.updateCredentials(id, data);
};

exports.login = async (auth) => {
    const {email, password} = auth;
    const user = await service.getEmail(email);

    if (user) {
        const match = bcrypt.compareSync(password, user['password']);

        if (match) {
            return [200, await service.generateTokenUser({
                email: user['email'],
                user: user['user']
            })];

        } else {
            return [401, {'message': 'Incorrect password'}];
        }

    } else {
        return [404, {'message': 'Not found user'}];
    }
};
