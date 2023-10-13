/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating pets services.
 */

const petsService = require('../services/petsServices');
const service = new petsService();


/**
 * Insert lost pets in array of user
 * @async
 * @function
 * @param {string} id - ID user
 * @param {Object} dog_data - Body request data
 * @returns {Promise<void>}
 * */

exports.insertLostPet = async (id, dog_data) => {
    await service.insertLostPet(id, dog_data);
};

/**
 * Get all lost pet from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {boolean} isOwner
 * @returns {Promise<Array>}
 * */

exports.getPosts = async (id, isOwner) => {
    return await service.getPosts(id, isOwner);
};

/**
 * Get lost pet from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} dog_name - Pet name identifier
 * @returns {Promise<Array>}
 * */

exports.getMyPostByName = async (id, pet_name) => {
    return await service.getMyPostByName(id, pet_name);
};

/**
 * Get lost pet from other users' arrays by name.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_name - Pet name identifier
 * @returns {Promise<Array>}
 */

exports.getOtherPostByName = async (id, pet_name) => {
    return await service.getOtherPostByName(id, pet_name);
};

/**
 * Get lost pet from the user array by ID.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet ID identifier
 * @returns {Promise<Array>}
 */

exports.getMyPostById = async (id, pet_id) => {
    return await service.getMyPostById(id, pet_id);
};

/**
 * Get lost pet from other users' arrays by ID.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet ID identifier
 * @returns {Promise<Array>}
 */

exports.getOtherPostById = async (id, pet_id) => {
    return await service.getOtherPostById(id, pet_id);
};


/**
 * Get middleware for lost pets from the user array by name.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_name - Pet name identifier
 * @returns {Promise<Array>}
 */

exports.getMiddlewareMyPost = async (id, pet_name) => {
    return await service.getMiddlewareMyPost(id, pet_name);
};

/**
 * Get middleware for lost pets from other users' arrays by name.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_name - Pet name identifier
 * @returns {Promise<Array>}
 */

exports.getMiddlewareOtherPost = async (id, pet_name) => {
    return await service.getMiddlewareOtherPost(id, pet_name);
};

/**
 * Remove lost pet from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet name identifier
 * @returns {Promise<void>}
 * */

exports.delMyPost = async (id, pet_id) => {
    await service.delMyPost(id, pet_id);
};

/**
 * Remove lost pet from other users' arrays by ID.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet ID identifier
 * @returns {Promise<void>}
 */

exports.delOtherPost = async (id, pet_id) => {
    await service.delOtherPost(id, pet_id);
};

/**
 * Update partial lost pet from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_name - Pet name identifier
 * @param {Object} pet_data - Body request data
 * @returns {Promise<void>}
 * */

exports.updateMyPost = async (id, pet_id, pet_data) => {
    await service.updateMyPost(id, pet_id, pet_data);
};

/**
 * Update partial lost pet from other users' arrays by ID.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet ID identifier
 * @param {Object} pet_data - Body request data
 * @returns {Promise<void>}
 */

exports.updateOtherPost = async (id, pet_id, pet_data) => {
    await service.updateOtherPost(id, pet_id, pet_data);
};

/**
 * Insert tags for lost pet in the user array by ID.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet ID identifier
 * @param {Object} data - Body request data
 * @returns {Promise<void>}
 */

exports.insertTagsMyPost = async (id, pet_id, data) => {
    await service.insertTagsMyPost(id, pet_id, data);
};

/**
 * Insert tags for lost pet in other users' arrays by ID.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet ID identifier
 * @param {Object} data - Body request data
 * @returns {Promise<void>}
 */

exports.insertTagsOtherPost = async (id, pet_id, data) => {
    await service.insertTagsOtherPost(id, pet_id, data);
};

/**
 * Remove tags for lost pet from the user array by ID.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet ID identifier
 * @param {string} key - Tag key
 * @param {string} tag_value - Tag value
 * @returns {Promise<void>}
 */

exports.delTagsMyPost = async (id, pet_id, key, tag_value) => {
    await service.delTagsMyPost(id, pet_id, key, tag_value)
};

/**
 * Remove tags for lost pet from other users' arrays by ID.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} pet_id - Pet ID identifier
 * @param {string} key - Tag key
 * @param {string} tag_value - Tag value
 * @returns {Promise<void>}
 */

exports.delTagsOtherPost = async (id, pet_id, key, tag_value) => {
    await service.delTagsOtherPost(id, pet_id, key, tag_value)
};
