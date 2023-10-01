/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating user services.
 */

const userService = require('../services/userServices')
const service = new userService();

/**
 * Get all users
 * @returns {Promise<Array>}
 * */

exports.getUsers = async () => {
    return await service.getAll()
}

/**
 * Create new user
 * @param {Object} data - Body request data
 * @returns {Promise<void>}
 * */

exports.setUser = async (data) => {
    await service.create(data)
}

/**
 * Get user
 * @param {string} id - ID user
 * @returns {Promise<void>}
 * */

exports.getUser = async (id) => {
    return await service.getUser(id);
}

/**
 * Get user credentials (email and password)
 * @param {string} id - ID user
 * @returns {Promise<Array>}
 * */

exports.getCredentials = async (id) => {
    return await service.getCredentials(id)
}

/**
 * Delete user
 * @param {string} data - ID user
 * @returns {Promise<void>}
 * */

exports.delUser = async (id) => {
    await service.delUser(id)
}

/**
 * Update partial user
 * @param {string} id - ID user
 * @param {Object} data - Body request data
 * @returns {Promise<void>}
 * */

exports.updateUser = async (id, data) => {
    await service.updateUser(id, data)
}

/**
 * Update partial credentials (email or password)
 * @param {string} id - ID user
 * @param {Object} data - Body request data
 * @returns {Promise<void>}
 * */

exports.updateCredentials = async (id, data) => {
    await service.updateCredentials(id, data)
}
