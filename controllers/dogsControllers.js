/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating dogs services.
 */

const dogsService = require('../services/dogsServices');
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
    await service.insertLostDog(id, dog_data);
};

/**
 * Get all lost dog from user array
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
 * Get lost dog from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} dog_name - Dog name identifier
 * @returns {Promise<Array>}
 * */

exports.getMyPostByName = async (id, dog_name) => {
    return await service.getMyPostByName(id, dog_name);
};

exports.getOtherPostByName = async (id, dog_name) => {
    return await service.getOtherPostByName(id, dog_name);
};

exports.getMyPostById = async (id, dog_id) => {
    return await service.getMyPostById(id, dog_id);
};

exports.getOtherPostById = async (id, dog_id) => {
    return await service.getOtherPostById(id, dog_id);
};

exports.getMiddlewareMyPost = async (id, dog_name) => {
    return await service.getMiddlewareMyPost(id, dog_name);
};

exports.getMiddlewareOtherPost = async (id, dog_name) => {
    return await service.getMiddlewareOtherPost(id, dog_name);
};

/**
 * Remove lost dog from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} dog_name - Dog name identifier
 * @returns {Promise<void>}
 * */

exports.delMyPost = async (id, dog_id) => {
    await service.delMyPost(id, dog_id);
};

exports.delOtherPost = async (id, dog_id) => {
    await service.delOtherPost(id, dog_id);
};

/**
 * Update partial lost dog from user array
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} dog_name - Dog name identifier
 * @param {Object} dog_data - Body request data
 * @returns {Promise<void>}
 * */

exports.updateMyPost = async (id, dog_id, dog_data) => {
    await service.updateMyPost(id, dog_id, dog_data);
};

exports.updateOtherPost = async (id, dog_id, dog_data) => {
    await service.updateOtherPost(id, dog_id, dog_data);
};

exports.insertTagsMyPost = async (id, dog_id, data) => {
    await service.insertTagsMyPost(id, dog_id, data);
};

exports.insertTagsOtherPost = async (id, dog_id, data) => {
    await service.insertTagsOtherPost(id, dog_id, data);
};

exports.delTagsMyPost = async (id, dog_id, key, tag_value) => {
    await service.delTagsMyPost(id, dog_id, key, tag_value)
};

exports.delTagsOtherPost = async (id, dog_id, key, tag_value) => {
    await service.delTagsOtherPost(id, dog_id, key, tag_value)
};