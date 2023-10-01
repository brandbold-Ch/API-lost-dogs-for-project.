/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating application services.
 */

const appService = require('../services/appServices')
const service = new appService();

/**
 * Get all the lost dogs
 * @returns {Promise<Array>}
 * */

exports.getAllLostDogs = async () => {
    return await service.getAllLostDogs()
}
