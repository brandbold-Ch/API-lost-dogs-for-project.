/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to unauthenticated users
 */

const User = require('../models/user');

/**
 * Class that provides services related to the application.
 * @class
 */

class AppServices {

    constructor() {}

    /**
     * Get information about owners of lost dogs.
     * @async
     * @function
     * @returns {Promise<Array>} A Promise that will be resolved to a list of objects representing lost dog owner information.
     */

    async getAllLostDogs(){
        /**
         * Perform an aggregation operation to obtain information about lost dog owners.
         * @memberof AppServices
         * @inner
         * @type {Promise<Object[]>}
         */

        return User.aggregate([{
            /**
             * Project specific fields for output.
             * @type {Object}
             * @property {number} _id - The _id field is excluded from the output.
             * @property {string} owner - The 'name' field is renamed to 'owner'.
             * @property {number} cellphone - The 'cellphone' field is included in the output.
             * @property {number} lost_dogs - The 'lost_dogs' field is included in the output.
             */

            $project: {
                _id: 0,
                owner: "$name",
                cellphone: 1,
                lost_dogs: 1
            }
        }]);
    }
}

module.exports = AppServices;
