/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const User = require('../models/user');
const Auth = require('../models/auth');

/**
 * Class that provides CRUD services related to users.
 * @class
 */

class UserServices {

    constructor() {};

    async create(data){
        const { name, lastname, cellphone, email, password} = data;

        const user = new User({name, lastname, email, cellphone});
        const auth = new Auth({email, password, user: user._id});

        await user.save();
        await auth.save();
    };

    /**
     * Gets all users.
     * @async
     * @function
     * @returns {Promise<Array>} A Promise that will resolve to the list of users.
     */

    async getAll(){
        return User.find({});
    };

    /**
     * Obtains information about a user by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise<Array>} A Promise that will be resolved to the user's information.
     */

    async getUser(id){
        return User.findOne(
            {
                _id: id
            },
            {
                __v:0,
                _id: 0,
                lost_pets: 0
            }
        );
    };

    /**
     * Delete a user by their ID and also delete their credentials.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise <void>} A Promise that will be resolved once the removal of the user and its credentials is complete.
     */

    async delUser(id){
        await Auth.deleteOne(
            {
                user: id
            }
        );
        await User.deleteOne(
            {
                _id: id
            }
        );
    };

    /**
     * Updates a user's information by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @param {Object} data - New user data.
     * @returns {Promise<void>} A Promise that will be resolved once the user update is complete.
     */

    async updateUser(id, data){
        await User.updateOne(
            {
                _id: id
            },
            {
                $set: data
            },
            {
                runValidators: true
            }
        );
    };

    /**
     * Updates a user's network information by their ID and network platform.
     * @async
     * @function
     * @param {string} id - User ID.
     * @param {string} network - Platform of the network to update.
     * @param {Object} data - New network data.
     * @returns {Promise<void>} A Promise that will be resolved once the network update is complete.
     */

    async updateSocialMedia(id, network, data){
        await User.updateOne(
            {
                _id: id,
                "social_media.platform": network
            },
            {
                $set: {
                    "social_media.$": data
                }
            },
        );
    };
}

module.exports = UserServices;
