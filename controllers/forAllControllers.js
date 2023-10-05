/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating application services.
 */

const forAllServices = require('../services/forAllServices')
const service = new forAllServices();

/**
 * Get all the lost dogs
 * @async
 * @function
 * @returns {Promise<Array>}
 * */

exports.getAllLostDogs = async () => {
    return await service.getAllLostDogs()
}
