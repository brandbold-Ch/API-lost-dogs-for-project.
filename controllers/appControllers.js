/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating application services.
 */

const appService = require('../services/appServices')
const service = new appService();

/**
 * Get all the lost dogs
 * @async
 * @function
 * @returns {Promise<Object[]>}
 * */

exports.getAllLostDogs = async () => {
    return await service.getAllLostDogs()
}
