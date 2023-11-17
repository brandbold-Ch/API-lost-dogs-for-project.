/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const { User } = require('../models/user');
const Pet = require('../models/pets');
const Auth = require('../models/auth');
const { cloudinary } = require('../configurations/config');

/**
 * Class that provides CRUD services related to users.
 * @class
 */

class UserServices {

    constructor() {};

    async create(data){
        const { name, lastname, cellphone, email, password } = data;

        const user = new User({name, lastname, cellphone});
        const auth = new Auth({email, password, user: user._id, role: 'USER'});

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

    async getUser(id) {
        return User.findById(id, {
            __v:0,
            _id: 0,
        })
    };

    /**
     * Delete a user by their ID and also delete their credentials.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise <void>} A Promise that will be resolved once the removal of the user and its credentials is complete.
     */

    async delUser(id) {
        await Promise.all([
            Auth.findOneAndDelete({ user: id }),
            User.findByIdAndDelete({ _id: id }),
        ]);

        const array = await Pet.find({ user: id });

        if (array.length) {
            await Promise.all(
                array.map(async pet => {
                    if (pet.identify.image) {
                        await cloudinary.uploader.destroy(pet.identify.image.id);
                    }

                    if (pet.identify.gallery.length) {
                        await Promise.all(
                            pet.identify.gallery.map(async image => {
                                await cloudinary.uploader.destroy(image.id);
                            })
                        );
                    }
                    await Pet.deleteOne({ _id: pet._id });
                })
            );
        }
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
        await User.findByIdAndUpdate(
            id,
            { $set: data },
            { runValidators: true }
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
            { _id: id, "social_media.platform": network },
            { $set: { "social_media.$.user": data }},
        );
    };
}

module.exports = UserServices;
