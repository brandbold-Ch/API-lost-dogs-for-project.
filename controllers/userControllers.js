/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating user services.
 */

const userService = require('../services/userServices')
const service = new userService();

/**
 * Get all users
 * @async
 * @function
 * @returns {Promise<Array>}
 * */

exports.getUsers = async () => {
    return await service.getAll()
}

/**
 * Create new user
 * @async
 * @function
 * @param {Object} data - Body request data
 * @returns {Promise<void>}
 * */

exports.setUser = async (data) => {
    await service.create(data)
}

/**
 * Get user
 * @async
 * @function
 * @param {string} id - ID user
 * @returns {Promise<void>}
 * */

exports.getUser = async (id) => {
    return await service.getUser(id);
}

/**
 * Delete user
 * @async
 * @function
 * @param {string} data - ID user
 * @returns {Promise<void>}
 * */

exports.delUser = async (id) => {
    await service.delUser(id)
}

/**
 * Update partial user
 * @async
 * @function
 * @param {string} id - ID user
 * @param {Object} data - Body request data
 * @returns {Promise<void>}
 * */

exports.updateUser = async (id, data) => {
    await service.updateUser(id, data)
}
