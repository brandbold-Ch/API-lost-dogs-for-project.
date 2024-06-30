/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const { User } = require("../models/user");
const { Post } = require("../models/post");
const { Auth } = require("../models/auth");
const { Request } = require("../models/rescuer");
const { PostServices } = require("../services/postServices");
const { connection } = require("../config/connections");
const { ImageTools } = require("../utils/imageTools");


/**
 * Class that provides CRUD services related to users.
 * @class
 */

class UserServices {

    constructor() {
        this.posts = new PostServices();
        this.imageTools = new ImageTools();
    }

    async createUser(user_data) {
        const { name, lastname, phone_number, email, password, social_networks } = user_data;
        const session = await connection.startSession();
        let output_user, output_auth;

        await session.withTransaction(async () => {
            await User.create([{
                name: name,
                lastname: lastname,
                phone_number: phone_number,
                social_networks: social_networks
            }], { session })
                .then((user) => {
                    output_user = user[0];
                });

            await Auth.create([{
                email: email,
                password: password,
                user_id: output_user["_id"],
                role: "USER",
                doc_model: "User"
            }], { session })
                .then((auth) => {
                    output_auth = auth[0];
                });

            await User.findByIdAndUpdate(
                output_user["_id"],
                {
                    $set: { auth_id: output_auth["_id"] }
                },
                { new: true }
            ).session(session)
                .then((user) => {
                    output_user = user;
                });
        });

        await session.endSession();
        return output_user;
    }

    /**
     * Gets all users.
     * @async
     * @function
     * @returns {Promise<Array>} A Promise that will resolve to the list of users.
     */

    async getUsers() {
        return User.find({}, { posts_id: 0, bulletins_id: 0 })
            .populate("auth_id", { email: 1, password: 1, _id: 0 });
    }

    /**
     * Obtains information about a user by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise<Array>} A Promise that will be resolved to the user's information.
     */

    async getUser(id) {
        return User.findById(id, { posts_id: 0 })
            .populate("auth_id", { email: 1, password: 1, _id: 0 });
    }

    /**
     * Delete a user  by their ID and also delete their credentials.
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
                Auth.deleteOne({ user_id: id }, { session }),
                User.deleteOne({ _id: id }, { session }),
                Post.deleteMany({ user_id: id }, { session }),
                Request.deleteMany({ user_id: id }, { session }),
            ]);
        })
            .then(async () => {
                if (array_urls_posts.length) {
                    await this.imageTools.deleteImages(array_urls_posts[0]["allIds"]);
                }
            })

        await session.endSession();
    };

    /**
     * Updates a user's information by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @param {Object} user_data - New user data.
     * @returns {Promise<void>} A Promise that will be resolved once the user update is complete.
     */

    async updateUser(id, user_data) {
        const { name, lastname, phone_number, social_networks } = user_data;
        const socials = (social_networks)? Object.keys(social_networks).map(
            key => ({ [key]: social_networks[key] })
        ): undefined;

        return User.findByIdAndUpdate(id,
            {
                $set: {
                    name: name,
                    lastname: lastname,
                    phone_number: phone_number,
                    social_networks: socials
                }
            },
            { new: true }
        );
    }

    async deleteSocialMedia(id, key, value) {
        await User.updateOne({ _id: id }, { $pull: { social_networks: { [key]: value } } });
    }

    async getRequests (id) {
        return Request.find({ user_id: id });
    }

    async changeRole(id, role, change) {
        let output_request;

        await Request.create([{
            requester_role: role,
            requested_role: change,
            user_id: id,
            doc_model: "User"
        }])
            .then((request) => {
                output_request = request[0]
            });

        return output_request;
    }
}

module.exports = { UserServices };
