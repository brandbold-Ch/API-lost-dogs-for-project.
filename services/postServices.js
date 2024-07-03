/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const { User } = require("../models/user");
const { Rescuer } = require("../models/rescuer");
const { Post } = require("../models/post");
const { ImageTools } = require("../utils/imageTools");
const { connection } = require("../config/connections");
const mongoose = require("mongoose");
const {Association} = require("../models/association");

/**
 *Class that provides CRUD services related to lost pets.
 * @class
 */

class PostServices {

    constructor() {
        this.imageTools = new ImageTools();
    }

    modelDetector(role) {
        switch (role) {
            case "USER":
                return ["User", User];

            case "RESCUER":
                return ["Rescuer", Rescuer];

            case "ASSOCIATION":
                return ["Association", Association];
        }
    }

    async addGalleryToAPost(id, post_id, images) {
        await Promise.all(images.map(async (key) => {
            //await sharp(key["buffer"]).webp().toBuffer()
            let new_image = await this.imageTools.uploadImage(key["buffer"]);
            let selector;

            if (key["fieldname"] === "image") {
                selector = {
                    $set: {
                        "identify.image": new_image
                    }
                }

            } else {
                selector = {
                    $push: {
                        "identify.gallery": new_image
                    }
                }
            }

            await Post.updateOne({_id: post_id, user_id: id}, selector);
        }));
    }

    async allPosts(id) {
        return Post.find({user_id: id}).sort({"publication.lost_date": -1});
    }

    async getPost(id, post_id) {
        return Post.findOne({_id: post_id, user_id: id});
    }

    async getPostForGuest(id) {
        return Post.findById(id);
    }

    async createPost(id, post_data, role) {
        const session = await connection.startSession();
        const collection = this.modelDetector(role);
        const obj_data = post_data[0];
        const array_images = post_data[1];
        let output_post;
        const parsedInfo = () => {
            if (obj_data["location"]) {
                return JSON.parse(obj_data["location"])
            }
            return undefined;
        }

        await session.withTransaction(async () => {
            await Post.create([
                {
                    name: obj_data["name"],
                    details: {
                        specie: obj_data["specie"],
                        gender: obj_data["gender"],
                        age: obj_data["age"],
                        description: obj_data["description"],
                        size: obj_data["size"],
                        breed: obj_data["breed"]
                    },
                    publication: {
                        lost_date: obj_data["lost_date"],
                        location: parsedInfo(),
                        last_seen: obj_data["last_seen"]
                    },
                    status: {
                        owner: obj_data["owner"]
                    },
                    user_id: id,
                    doc_model: collection[0]
                }
            ], {session})
                .then(async (post) => {
                    output_post = post[0];
                })

            await collection[1].updateOne(
                {
                    _id: id
                },
                {
                    $push: {
                        posts_id: output_post["_id"]
                    }
                },
                {session}
            );
        })
            .then(async () => {
                if (array_images.length) {
                    await this.addGalleryToAPost(id, output_post["_id"], array_images);
                }
            });

        await session.endSession();
        return output_post;
    }

    async getPosts(id) {
        return await this.allPosts(id);
    }

    async getFilterPostGender(id, gender) {
        const array = await this.allPosts(id);
        return array.filter(key => key.details.gender === gender);
    }

    async getFilterPostBreed(id, breed) {
        const array = await this.allPosts(id);
        return array.filter(key => key.details.breed === breed);
    }

    async getFilterPostSize(id, size) {
        const array = await this.allPosts(id);
        return array.filter(key => key.details.size === size);
    }

    async getFilterPostOwner(id, owner) {
        const array = await this.allPosts(id);
        return array.filter(key => key.status.owner === JSON.parse(owner));
    }

    async getFilterPostFound(id, found) {
        const array = await this.allPosts(id);
        return array.filter(key => key.status.found === JSON.parse(found));
    }

    async getFilterPostSpecie(id, specie) {
        const array = await this.allPosts(id);
        return array.filter(key => key.details.specie === specie);
    }

    async getFilterPostLostDate(id, lost_date) {
        const array = await this.allPosts(id);

        return array.filter(key => {
            const date = key.publication.lost_date
            return date.toISOString() === lost_date.substring(0, 23) + "Z";
        });
    }

    async getFilterPostYear(id, year) {
        const array = await this.allPosts(id);

        return array.filter(key => {
            const date = key.publication.lost_date
            return date.getFullYear() === parseInt(year);
        });
    }

    async deletePartialGallery(id, post_id, queries) {
        const session = await connection.startSession();
        let output_update, chunk, selector;

        if (queries["tag"] === "image") {
            selector = {
                "identify.image.id": queries["id"]
            }
            chunk = {
                $set: {
                    "identify.image": null
                }
            }

        } else {
            selector = {
                "identify.gallery.id": queries["id"]
            }
            chunk = {
                $pull: {
                    "identify.gallery": {
                        id: queries["id"]
                    }
                }
            }
        }

        await session.withTransaction(async () => {
            await Post.updateOne(
                {
                    _id: post_id,
                    user_id: id,
                    ...selector
                },
                chunk,
                {session}
            )
                .then((update) => {
                    output_update = update;
                });
        })
            .then(async () => {
                if (output_update["modifiedCount"] !== 0) {
                    await this.imageTools.deleteImages(queries["id"]);
                }
            })

        await session.endSession();
    }

    async deletePost(id, post_id, role) {
        const session = await connection.startSession();
        const collection = this.modelDetector(role);
        let output_post;

        await session.withTransaction(async () => {
            await Post.findOneAndDelete(
                {
                    _id: post_id,
                    user_id: id
                },
                {session}
            )
                .then((post) => {
                    output_post = post;
                })

            await collection[1].updateOne(
                {
                    _id: id
                },
                {
                    $pull: {
                        posts_id: post_id
                    }
                }, {session}
            );
        })
            .then(async () => {
                if (output_post["identify"]["image"]) {
                    await this.imageTools.deleteImages(output_post["identify"]["image"]["id"]);
                }

                if (output_post["identify"]["gallery"].length) {
                    await this.imageTools.deleteGallery(output_post["identify"]["gallery"]);
                }
            })

        await session.endSession();
    }

    async updatePost(id, post_id, post_data) {
        const context_post = await this.getPost(id, post_id);
        const session = await connection.startSession();
        const obj_data = post_data[0];
        const array_images = post_data[1];
        let output_post;
        const parsedInfo = () => {
            if (obj_data["location"]) {
                return JSON.parse(obj_data["location"])
            }
            return undefined;
        }

        await session.withTransaction(async () => {
            await Post.findOneAndUpdate(
                {
                    _id: post_id,
                    user_id: id
                },
                {
                    $set: {
                        name: obj_data["name"],
                        details: {
                            specie: obj_data["specie"],
                            gender: obj_data["gender"],
                            age: obj_data["age"],
                            description: obj_data["description"],
                            size: obj_data["size"],
                            breed: obj_data["breed"]
                        },
                        publication: {
                            lost_date: obj_data["lost_date"],
                            location: parsedInfo(),
                            update: Date.now(),
                            published: context_post["publication"]["published"],
                            last_seen: obj_data["last_seen"]
                        },
                        status: {
                            owner: obj_data["owner"],
                            found: obj_data["found"]
                        },
                        identify: {
                            image: context_post["identify"]["image"],
                            gallery: context_post["identify"]["gallery"]
                        },
                        feedback: {
                            comments: context_post["feedback"]["comments"],
                        }
                    }
                },
                {
                    runValidators: true,
                    new: true
                }
            ).session(session)
                .then((post) => {
                    output_post = post;
                })

        })
            .then(async () => {
                if (array_images.length) {
                    await this.addGalleryToAPost(id, post_id, array_images);
                }
            })

        await session.endSession();
        return output_post;
    }

    async insertComment(id, post_id, data, role) {
        const collection = this.modelDetector(role);
        const entity = await collection[1].findById(id, { name: 1 });
        const comment = { title: data, timestamp: Date.now(), user_id: entity }

        await Post.updateOne(
            {
                _id: post_id
            },
            {
                $push: {
                    "feedback.comments": comment
                }
            }
        );

        return comment;
    }

    async getUrlsImages(id) {
        return Post.aggregate([
            {
                $match: {user_id: new mongoose.Types.ObjectId(id)}
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
                    "allIds": {$addToSet: "$allIds"}
                }
            },
            {
                $project: {
                    _id: 0,
                    "allIds": 1
                }
            }
        ]);
    }
}

module.exports = { PostServices };
