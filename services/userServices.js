/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const {User} = require("../models/user");
const {Post} = require("../models/post");
const {Auth} = require("../models/auth");
const {Request} = require("../models/rescuer");
const {PostServices} = require("../services/postServices");
const {cloudinary, connection} = require("../configurations/connections");


/**
 * Class that provides CRUD services related to users.
 * @class
 */

class UserServices {

    constructor() {
        this.posts = new PostServices();
    }

    /////////////////////////////////////////////////

    async deleteImages(gallery) {
        if (gallery.length) {
            await cloudinary.api.delete_resources(
                gallery,
                {
                    type: 'upload',
                    resource_type: 'image'
                }
            );
        }
    }

    /////////////////////////////////////////////////

    async setUser(data) {
        const {name, lastname, cellphone, email, password} = data;
        const session = await connection.startSession();
        let output_user, output_auth;

        await session.withTransaction(async () => {

            await User.create([
                {
                    name: name,
                    lastname: lastname,
                    cellphone: cellphone
                }
            ], {session})
                .then((user) => {
                    output_user = user[0];
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user: output_user["_id"],
                    role: "USER",
                    doc_model: "User"
                }
            ], {session})
                .then((auth) => {
                    output_auth = auth[0];
                });

            await User.updateOne(
                {
                    _id: output_user["_id"]
                },
                {
                    $set: {
                        auth: output_auth["_id"]
                    }
                },
                {session}
            );
        });
        await session.endSession();

        return output_user;
    };

    /**
     * Gets all users.
     * @async
     * @function
     * @returns {Promise<Array>} A Promise that will resolve to the list of users.
     */

    async getUsers() {
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
        return User.findById(id);
    };

    /**
     * Delete a user by their ID and also delete their credentials.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise <void>} A Promise that will be resolved once the removal of the user and its credentials is complete.
     */

    async deleteUser(id) {
        const session = await connection.startSession();
        const array_urls_posts = await this.posts.getUrlsImages(id);

        await session.withTransaction(async () => {

            await Promise.all([
                Auth.findOneAndDelete({user: id}, {session}),
                User.findByIdAndDelete({_id: id}, {session}),
                Post.deleteMany({user: id}, {session}),
                Request.deleteMany({user: id}, {session})
            ]);

        })
            .then(async () => {

                if (array_urls_posts.length) {
                    await this.deleteImages(array_urls_posts[0]["allIds"]);
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
        return User.findByIdAndUpdate(id,
            {
                $set: data
            },
            {
                runValidators: true,
                new: true,
                select: "-posts -auth -social_media -bulletins"
            }
        );
    };

    /**
     * Updates a user's network information by their ID and network platform.
     * @async
     * @function
     * @param {string} id - User ID.
     * @param {Array} data - Platform of the network to update.
     * @returns {Promise<void>} A Promise that will be resolved once the network update is complete.
     */

    async addSocialMedia(id, data) {
        const toArray = [];

        for (const key in data) {
            toArray.push({[key]: data[key]})
        }
        await User.findByIdAndUpdate(id, {$push: {social_media: {$each: toArray}}});
    };

    async deleteSocialMedia(id, key, value) {
        if (key && value) {
            await User.findByIdAndUpdate(id, {$pull: {social_media: {[key]: value}}})
        }
    }

    async updateSocialMedia(id, data) {
        const key = Object.keys(data)[0];

        await User.updateOne(
            {
                _id: id,
                [`social_media.${key}`]: {
                    $exists: true
                }
            },
            {
                $set: {
                    [`social_media.$.${key}`]: data[key]
                }
            },
        )
    }

    async makeRescuer(id) {
        const email = await Auth.findOne({user: id});

        const output_request = await Request.create([
            {
                role: "USER",
                email: email["email"],
                user: id
            }
        ]);

        return output_request[0];
    }
}

module.exports = {UserServices};
