/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating dogs services.
 */

const dogsService = require('../services/dogsServices')
const service = new dogsService();


/**
 * Insert lost dog in array of user
 * @async
 * @function
 * @param {string} id - ID user
 * @param {Object} dog_data - Body request data
 * @returns {Promise<void>}
 * */

exports.insertLostDog = async (id, dog_data) => {
    await service.insertLostDog(id, dog_data)
}

/**
 * Get all lost dog from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @returns {Promise<Array>}
 * */

exports.getPosts = async (id) => {
    return await service.getPosts(id)
}

/**
 * Get lost dog from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} dog_name - Dog name identifier
 * @returns {Promise<Array>}
 * */

exports.getPost = async (id, dog_name) => {
    return await service.getPost(id, dog_name)
}

/**
 * Remove lost dog from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} dog_name - Dog name identifier
 * @returns {Promise<void>}
 * */

exports.delPost = async (id, dog_name) => {
    await service.delPost(id, dog_name)
}

/**
 * Update partial lost dog from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} dog_name - Dog name identifier
 * @param {Object} dog_data - Body request data
 * @returns {Promise<void>}
 * */

exports.updatePost = async (id, dog_name, dog_data) => {
    await service.updatePost(id, dog_name, dog_data)
}
