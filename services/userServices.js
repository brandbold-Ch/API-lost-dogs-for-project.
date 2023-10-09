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

    /**
     * Create a new user and their authentication information.
     * @async
     * @function
     * @param {Object} data - User data and authentication credentials.
     * @param {string} data.email - User's email.
     * @param {string} data.password - User password.
     * @param {string} data.name - Name of the user.
     * @param {string} data.lastname - Last name of the user.
     * @param {string} data.cellphone - User's phone number.
     * @returns {Promise<void>} A Promise that will be resolved once the creation of the user and credentials is complete.
     */

    async create(data){
        const { email, password } = data;
        const { name, lastname, cellphone } = data;

        // Create a new user and their authentication credentials.
        const user = new User({name, lastname, email, cellphone});
        const auth = new Auth({email, password, user: user._id});

        await auth.save();
        await user.save();
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
             {_id: id},
             {__v:0, _id: 0, my_lost_dogs: 0, the_lost_dogs: 0}
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
        await Auth.deleteOne({user: id});
        await User.deleteOne({_id: id});
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
            {_id: id},
            {$set: data},
            {runValidators: true}
        );
    };

    async updateNetwork(id, network, data){
        await User.updateOne(
            {_id: id, "my_networks.platform": network},
            {$set: {"my_networks.$": data}},
            {runValidators: true}
        );
    };
}

module.exports = UserServices;