/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const {User} = require("../models/user");
const {Rescuer} = require("../models/rescuer");
const {Admin} = require("../models/administrator");
const {Post} = require("../models/post");
const {ImageTools} = require("../utils/imageTools");
const {connection} = require("../configurations/connections");
const mongoose = require("mongoose");

/**
 *Class that provides CRUD services related to lost pets.
 * @class
 */

class PostServices {

    constructor() {
        this.imageTools = new ImageTools();
    }

    modelDetector(role) {
        switch (role[0]) {
            case "USER":
                return ["User", User];

            case "RESCUER":
                return ["Rescuer", Rescuer];

            case "ADMINISTRATOR":
                return ["Admin", Admin];
        }
    }

    async addGalleryToAPost(id, pet_id, images) {
        await Promise.all(images.map(async (key) => {
            let new_image = await this.imageTools.uploadImage(key["buffer"]);

            if (key["fieldname"] === "image") {
                await Post.updateOne(
                    {
                        _id: pet_id,
                        user: id
                    },
                    {
                        $set: {
                            "identify.image": new_image
                        }
                    }
                );

            } else {
                await Post.updateOne(
                    {
                        _id: pet_id,
                        user: id
                    },
                    {
                        $push: {
                            "identify.gallery": new_image
                        }
                    }
                );
            }
        }));
    };

    async postsAll(id) {
        return Post.find({user: id}).sort({"publication.lost_date": -1});
    }

    async getPost(id, pet_id) {
        return Post.findOne({_id: pet_id, user: id});
    };

    async setPost(id, pet_data, role) {
        const session = await connection.startSession();
        const collection = this.modelDetector(role);
        const obj_data = pet_data[0];
        const array_images = pet_data[1];
        let output_post;

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
                        coordinates: JSON.parse(obj_data["coordinates"]),
                        last_seen: obj_data["last_seen"]
                    },
                    status: {
                        owner: obj_data["owner"]
                    },
                    user: id,
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
                        posts: output_post["_id"]
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
    };

    async getPosts(id) {
        return await this.postsAll(id);
    };

    async getFilterPostGender(id, gender) {
        const array = await this.postsAll(id);
        return array.filter(key => key.details.gender === gender);
    };

    async getFilterPostBreed(id, breed) {
        const array = await this.postsAll(id);
        return array.filter(key => key.details.breed === breed);
    };

    async getFilterPostSize(id, size) {
        const array = await this.postsAll(id);
        return array.filter(key => key.details.size === size);
    };

    async getFilterPostOwner(id, owner) {
        const array = await this.postsAll(id);
        return array.filter(key => key.status.owner === JSON.parse(owner));
    };

    async getFilterPostFound(id, found) {
        const array = await this.postsAll(id);
        return array.filter(key => key.status.found === JSON.parse(found));
    };

    async getFilterPostSpecie(id, specie) {
        const array = await this.postsAll(id);
        return array.filter(key => key.details.specie === specie);
    };

    async getFilterPostLostDate(id, lost_date) {
        const array = await this.postsAll(id);

        return array.filter(key => {
            const date = key.publication.lost_date
            return date.toISOString() === lost_date.substring(0, 23) + "Z";
        });
    }

    async getFilterPostYear(id, year) {
        const array = await this.postsAll(id);

        return array.filter(key => {
            const date = key.publication.lost_date
            return date.getFullYear() === parseInt(year);
        });
    }

    async deletePartialGallery(id, pet_id, queries) {
        const session = await connection.startSession();
        let output_update;

        await session.withTransaction(async () => {

            if (queries["tag"] === "image") {
                await Post.updateOne(
                    {
                        _id: pet_id,
                        user: id
                    },
                    {
                        $set: {
                            "identify.image": null
                        }
                    },
                    {session}
                )
                    .then((update) => {
                        output_update = update;
                    });

            } else {
                await Post.updateOne(
                    {
                        _id: pet_id,
                        user: id
                    },
                    {
                        $pull: {
                            "identify.gallery": {
                                id: queries["id"]
                            }
                        }
                    },
                    {session}
                )
                    .then((update) => {
                        output_update = update;
                    });
            }
        })
            .then(async () => {
                if (output_update["modifiedCount"] !== 0) {
                    await this.imageTools.deleteImages(queries["id"]);
                }
            })

        await session.endSession();
    }

    async deletePost(id, pet_id, role) {
        const session = await connection.startSession();
        const array_urls = await Post.findOne({_id: pet_id, user: id}, {identify: 1});
        const collection = this.modelDetector(role);

        await session.withTransaction(async () => {

            await Post.deleteOne({_id: pet_id, user: id}, {session});
            await collection[1].updateOne({_id: id}, {$pull: {posts: pet_id}}, {session});

        })
            .then(async () => {
                await Promise.all([
                    this.imageTools.deleteImages(array_urls["identify"]["image"]),
                    this.imageTools.deleteGallery(array_urls["identify"]["gallery"])
                ]);

            })

        await session.endSession();
    };

    async updatePost(id, pet_id, pet_data) {
        const context_post = await this.getPost(id, pet_id);
        const session = await connection.startSession();
        const obj_data = pet_data[0];
        const array_images = pet_data[1];
        let output_post;

        await session.withTransaction(async () => {

            await Post.findOneAndUpdate(
                {
                    _id: pet_id,
                    user: id
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
                            coordinates: JSON.parse(obj_data["coordinates"]),
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
                },
                {session}
            )
                .then((post) => {
                    output_post = post;
                })

        })
            .then(async () => {
                if (array_images.length) {
                    await this.addGalleryToAPost(id, pet_id, array_images);
                }
            })

        await session.endSession();
        return output_post;
    }

    async insertComment(id, pet_id, data, role) {
        const collection = this.modelDetector(role);
        const entity = await collection[1].findById(id, {name: 1});
        const comment = {title: data, timestamp: Date.now(), user: entity}

        await Post.updateOne(
            {
                _id: pet_id
            },
            {
                $push: {
                    "feedback.comments": comment
                }
            }
        );

        return comment;
    };

    async getUrlsImages(id) {
        return Post.aggregate([
            {
                $match: {user: new mongoose.Types.ObjectId(id)}
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

module.exports = {PostServices};
