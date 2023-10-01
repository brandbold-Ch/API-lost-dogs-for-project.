/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const User = require('../models/user')


/**
 *Class that provides CRUD services related to lost dogs.
 * @class
 */

class DogsServices {
    constructor() {}

    /**
     * Insert a lost dog into a user's lost dog list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {Object} dog_data - Dog data to insert.
     * @returns {Promise<void>} A Promise that will be resolved to the result of the insert operation.
     */

    async insertLostDog(id, dog_data) {
        await User.updateOne({_id: id}, {$push: {lost_dogs: dog_data}})
    }

    /**
     * Gets the list of a user's lost dogs.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @returns {Promise<Array>} A Promise that will be resolved to the user's list of lost dogs.
     */

    async getPosts(id) {
        return User.find({_id: id}, {lost_dogs: 1})
    }

    /**
     * Gets a specific lost dog from a user's lost dog list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} dog_name - Name of the dog to search for.
     * @returns {Promise<Array>} A Promise that will be resolved to the list of lost dogs that match the specified name.
     */

    async getPost(id, dog_name) {
        return User.find({_id: id}, {lost_dogs: {$elemMatch: {dog_name: dog_name}}})
    }

    /**
     * Removes a lost dog from a user's lost dog list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} dog_name - Name of the dog to remove.
     * @returns {Promise<void>}
     */

    async delPost(id, dog_name) {
        await User.updateOne({_id: id}, {$pull: {lost_dogs: {dog_name: dog_name}}})
    }

    /**
     * Updates the information of a lost dog in a user's lost dog list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} dog_name - Name of the dog to update.
     * @param {Object} dog_data - New dog data.
     * @returns {Promise<void>}
     */

    async updatePost(id, dog_name, dog_data) {
        await User.updateOne(
            {_id: id, "lost_dogs.dog_name": dog_name},
            {$set: {"lost_dogs.$": dog_data}}
        )
    }
}

module.exports = DogsServices;