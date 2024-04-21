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
const {connection} = require("../configurations/connections");
const {ImageTools} = require("../utils/imageTools");


/**
 * Class that provides CRUD services related to users.
 * @class
 */

class UserServices {

    constructor() {
        this.posts = new PostServices();
        this.imageTools = new ImageTools();
    }

    async setUser(data) {
        const {name, lastname, cellphone, email, password} = data;
        const session = await connection.startSession();
        let output_user, output_auth;

        await session.withTransaction(async () => {

            await User.create([
                {
                    name: name,
                    lastname: lastname,
                    cellphone: cellphone,
                    social_networks: data["social_networks"]
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

            await User.findByIdAndUpdate(
                output_user["_id"],
                {
                    $set: {
                        auth: output_auth["_id"]
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
        return User.findById(id)
            .populate("auth",
                {email: 1, password: 1, _id: 0}
            )
            .populate({
                path: "posts",
                options: {
                    sort: {
                        "publication.published": -1
                    }
                }
            })
            .populate({
                path: "bulletins",
                options: {
                    sort: {
                        "identify.timestamp": -1
                    }
                }
            });
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
     * @param {Object} data - New user data.
     * @returns {Promise<void>} A Promise that will be resolved once the user update is complete.
     */

    async updateUser(id, data) {
        const {name, lastname, cellphone, social_networks} = data;
        const socials = [];

        for (const key in social_networks) {
            socials.push({[key]: social_networks[key]})
        }

        return User.findByIdAndUpdate(id, {
                $set: {
                    name: name,
                    lastname: lastname,
                    cellphone: cellphone,
                    social_networks: socials
                }
            },
            {
                new: true,
                upsert: true
            }
        );
    }

    async deleteSocialMedia(id, key, value) {
        if (key && value) {
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
