/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const {User} = require("../models/user");
const {Post} = require("../models/post");
const {Blog} = require("../models/blog");
const {Auth} = require("../models/auth");
const {Request} = require("../models/rescuer");
const {PostServices} = require("../services/postServices");
const {BulletinServices} = require("../services/bulletinServices");
const {BlogServices} = require("../services/blogServices");
const {connection} = require("../configurations/connections");
const {ImageTools} = require("../utils/imageTools");
const {Bulletin} = require("../models/bulletin");


/**
 * Class that provides CRUD services related to users.
 * @class
 */

class UserServices {

    constructor() {
        this.posts = new PostServices();
        this.bulletins = new BulletinServices();
        this.blogs = new BlogServices();
        this.imageTools = new ImageTools();
    }

    async setUser(user_data) {
        const {name, lastname, phone_number, email, password} = user_data;
        const session = await connection.startSession();
        let output_user, output_auth;

        await session.withTransaction(async () => {
            await User.create([
                {
                    name: name,
                    lastname: lastname,
                    phone_number: phone_number,
                    social_networks: user_data["social_networks"]
                }
            ], {session})
                .then((user) => {
                    output_user = user[0];
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user_id: output_user["_id"],
                    role: "USER",
                    doc_model: "User"
                }
            ], {session})
                .then((auth) => {
                    output_auth = auth[0];
                });

            await User.findByIdAndUpdate(
                output_user["_id"],
                {
                    $set: {
                        auth_id: output_auth["_id"]
                    }
                },
                {
                    new: true
                }
            ).session(session)
                .then((newUser) => {
                    output_user = newUser;
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
        return User.find({}, {posts_id: 0, bulletins_id: 0})
            .populate("auth_id", {email: 1, password: 1, _id: 0});
    }

    /**
     * Obtains information about a user by their ID.
     * @async
     * @function
     * @param {string} id - User ID.
     * @returns {Promise<Array>} A Promise that will be resolved to the user's information.
     */

    async getUser(id) {
        return User.findById(id)
            .populate("auth_id",
                {email: 1, password: 1, _id: 0}
            )
    }

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
        const array_urls_bulletins = await this.bulletins.getUrlsImages(id);
        const array_urls_blogs = await this.blogs.getUrlsImages(id);

        await session.withTransaction(async () => {
            await Promise.all([
                Auth.deleteOne({user_id: id}, {session}),
                User.deleteOne({_id: id}, {session}),
                Post.deleteMany({user_id: id}, {session}),
                Request.deleteMany({user_id: id}, {session}),
                Bulletin.deleteMany({user_id: id}, {session}),
                Blog.deleteMany({user_id: id}, {session})
            ]);
        })
            .then(async () => {
                if (array_urls_bulletins.length) {
                    await this.imageTools.deleteImages(array_urls_bulletins[0]["allIds"]);
                }

                if (array_urls_posts.length) {
                    await this.imageTools.deleteImages(array_urls_posts[0]["allIds"]);
                }

                if (array_urls_blogs.length) {
                    await this.imageTools.deleteImages(array_urls_blogs[0]["allIds"]);
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
        const {name, lastname, phone_number, social_networks} = user_data;
        const socials = [];

        for (const key in social_networks) {
            socials.push({[key]: social_networks[key]})
        }

        return User.findByIdAndUpdate(id, {
                $set: {
                    name: name,
                    lastname: lastname,
                    phone_number: phone_number,
                    social_networks: socials
                }
            },
            {
                new: true
            }
        );
    }

    async deleteSocialMedia(id, key, value) {
        await User.updateOne(
            {
                _id: id
            },
            {
                $pull: {
                    social_networks: {[key]: value}
                }
            }
        );
    }

    async getRequests (id) {
        return Request.find({user_id: id});
    }

    async changeRole(id, role, change) {
        let output_request;

        await Request.create([
            {
                requester_role: role,
                requested_role: change,
                user_id: id,
                doc_model: "User"
            }
        ])
            .then((request) => {
                output_request = request[0]
            });

        return output_request;
    }
}

module.exports = {UserServices};
