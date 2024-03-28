/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const User = require("../models/user");
const Post = require("../models/post");
const Auth = require("../models/auth");
const { cloudinary, conn } = require("../configurations/connections");
const mongoose = require("mongoose");

/**
 * Class that provides CRUD services related to users.
 * @class
 */

class UserServices {

    constructor() {};

    /////////////////////////////////////////////////

    async deleteImages(gallery) {
        if (gallery.length) {
            await cloudinary.api.delete_resources(
                gallery, { type: 'upload', resource_type: 'image' }
            );
        }
    }
    /////////////////////////////////////////////////

    async createUser(data){
        const { name, lastname, cellphone, email, password } = data;
        const session = await conn.startSession();
        let output_data;

        await session.withTransaction(async () => {
            await User.create([
                {
                    name: name,
                    lastname: lastname,
                    cellphone: cellphone
                }
            ], { session })
                .then((user) => {
                    output_data = user;
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user: output_data[0]["_id"],
                    role: "USER"
                }
            ], { session });
        });
        await session.endSession();
    };

    /**
     * Gets all users.
     * @async
     * @function
     * @returns {Promise<Array>} A Promise that will resolve to the list of users.
     */

    async getUsers(){
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
        return User.findById(id, {_id: 0});
    };

    /**
     * Delete a user by their ID and also delete their credentials.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise <void>} A Promise that will be resolved once the removal of the user and its credentials is complete.
     */

    async deleteUser(id) {
        const session = await conn.startSession();

        const array_urls = await Post.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(id) }
            },
            {
                $project: {
                    "galleryIds": "$identify.gallery.id",
                    "imageId": "$identify.image.id"
                }
            },
            {
                $project: {
                    "allIds": {
                        $concatArrays: ["$galleryIds", ["$imageId"]]
                    }
                }
            },
            {
                $unwind: "$allIds"
            },
            {
                $group: {
                    _id: null,
                    "allIds": { $addToSet: "$allIds" }
                }
            },
            {
                $project: {
                    _id: 0,
                    "allIds": 1
                }
            }
        ]);

        await session.withTransaction(async () => {
            await Promise.all([
                Auth.deleteOne({ user: id }, {session}),
                User.deleteOne({ _id: id }, {session}),
                Post.deleteMany({ user: id }, {session}),
            ]);

        })
            .then(async () => {
                if (array_urls.length) {
                    await this.deleteImages(array_urls[0]["allIds"]);
                }
            })
            .catch((err) => {
                throw Error(err.message);
            })
        await session.endSession();
    };

    /**
     * Updates a user's information by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @param {Object} data - New user data.
     * @returns {Promise<void>} A Promise that will be resolved once the user update is complete.
     */

    async updateUser(id, data) {
        await User.findByIdAndUpdate(id, { $set: data }, { runValidators: true });
    };

    /**
     * Updates a user's network information by their ID and network platform.
     * @async
     * @function
     * @param {string} id - User ID.
     * @param {Array} data - Platform of the network to update.
     * @returns {Promise<void>} A Promise that will be resolved once the network update is complete.
     */

    async addSocialMedia(id, data){
        const toArray = [];

        for (const key in data) {
            toArray.push({[key]: data[key]})
        }
        await User.updateOne({ _id: id }, { $push: { social_media: {$each: toArray}}});
    };

    async deleteSocialMedia(id, key, value) {
        if (key && value) {
            await User.updateOne({ _id: id }, { $pull: {social_media: {[key]: value}} })
        }
    }

    async updateSocialMedia(id, data) {
        const key = Object.keys(data)[0];

        await User.updateOne(
            { _id: id, [`social_media.${key}`]: {$exists: true}},
            { $set: {[`social_media.$.${key}`]: data[key]} },
        )
    }
}

module.exports = UserServices;
