/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const User = require("../models/user");
const Collab = require("../models/collaborator");
const Post = require("../models/post");
const { cloudinary, conn } = require("../configurations/connections");
const mongoose = require("mongoose");

/**
 *Class that provides CRUD services related to lost pets.
 * @class
 */

class PostServices {

    constructor() {};

    ////////////////////////////////////////////////////////////////////
     async uploadImage(buffer) {
         return new Promise((resolve, reject) => {
             cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
                 if (error) { reject(error); }
                 resolve({
                     url: result?.url,
                     id: result?.public_id
                 });
             }).end(buffer);
         });
    }

    async deleteImage(img_id) {
        if (img_id) {
            await cloudinary.api.delete_resources(
                [img_id], { type: 'upload', resource_type: 'image' }
            );
        }
    }

     async deleteGallery(gallery) {
         if (gallery.length) {
             await cloudinary.api.delete_resources(
                 gallery.map((obj) => {
                     return obj["id"];
                 }),
                 {type: 'upload', resource_type: 'image'}
             );
         }
     }
    //////////////////////////////////////////////////////////////////////

    async postsAll(id) {
        return Post.find({ user: id }).sort({ "publication.lost_date": -1 });
    }

    async getGeneralPost(pet_id) {
        return Post.findById(pet_id);
    }

    async getPost(id, pet_id) {
        return Post.findOne({ _id: pet_id, user: id });
    };

    async insertLostPet(id, pet_data, role) {
        let user_ref, collection;

        if (role === "USER") {
            user_ref = await User.findById(id);
            collection = "User";
        } else {
            user_ref = await Collab.findById(id);
            collection = "Collab";
        }

        const session = await conn.startSession();
        const obj_data = pet_data[0];
        const obj_image = pet_data[1];
        let output_data;

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
                    user: user_ref["_id"],
                    doc_model: collection
                }
            ], { session })
                .then(async (post) => {
                    output_data = post;
                })
        })
            .then(async () => {
                if (obj_image.length) {
                    const index_image = obj_image.findIndex(obj => obj["fieldname"] === "image");

                    if (index_image !== -1) {
                        const image = await this.uploadImage(obj_image.splice(index_image, 1)[0]["buffer"]);
                        await Post.updateOne({ _id: output_data[0]["_id"] }, { $set: {"identify.image": image}});
                    }

                    await this.addGallery(id, output_data[0]["_id"], obj_image)
                }
            })
        await session.endSession();
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
            return date.toISOString() === lost_date.substring(0, 23)+"Z";
        });
    }

    async getFilterPostYear(id, year) {
        const array = await this.postsAll(id);

        return array.filter(key => {
            const date = key.publication.lost_date
            return date.getFullYear() === parseInt(year);
        });
    }

    async deletePartialGallery(id, pet_id, img_id) {
        const session = await conn.startSession();

        await session.withTransaction(async () => {
            await Post.updateOne(
                { _id: pet_id, user: id},
                { $pull: { "identify.gallery": { id: img_id }}},
                { session }
            );
        })
            .then(async () => {
                await this.deleteImage(img_id);

            })
            .catch((err) => {
                throw Error(err.message);
            })
        await session.endSession();
    }

    async deletePost(id, pet_id) {
        const session = await conn.startSession();
        const array_urls = await Post.findOne(
            { _id: pet_id, user: id },
            { identify: 1 }
        )

        await session.withTransaction(async () => {
            await Post.deleteOne(
                { _id: pet_id, user: id },
                { session }
            );
        })
            .then(async () => {
                await Promise.all([
                    this.deleteImage(
                        array_urls["identify"]["image"]["id"]
                    ),
                    this.deleteGallery(
                        array_urls["identify"]["gallery"]
                    )
                ]);

            }).catch((err) => {
                throw Error(err.message);
            })
        await session.endSession();
    };


    async updatePost(id, pet_id, pet_data) {
        const context_pet = await this.getPost(id, pet_id);
        const session = await conn.startSession();
        const obj_data = pet_data[0];
        const obj_image = pet_data[1];

        await session.withTransaction(async () => {
            await Post.updateOne(
                { _id: pet_id, user: id },
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
                            published: context_pet["publication"]["published"],
                            last_seen: obj_data["last_seen"]
                        },
                        status: {
                            owner: obj_data["owner"],
                            found: obj_data["found"]
                        },
                        identify: {
                            image: context_pet["identify"]["image"],
                            gallery: context_pet["identify"]["gallery"]
                        },
                        feedback: {
                            comments: context_pet["feedback"]["comments"],
                        }
                    }
                },
                {
                    runValidators: true
                },
                { session })

        }).then(async () => {
            if (obj_image !== undefined) {
                const new_image = await this.uploadImage(obj_image["buffer"]);
                await this.deleteImage(context_pet["identify"]["image"]["id"]);

                await Post.updateOne(
                    { _id: pet_id, user: id },
                    {$set: { "identify.image": new_image } }
                )
            }

        }).catch((err) => {
            throw Error(err.message);
        })
        await session.endSession();
    }

    async addGallery(id, pet_id, images) {
        await Promise.all(images.map(async (key) => {
            let new_image = await this.uploadImage(key["buffer"]);

            await Post.updateOne(
                { _id: pet_id, user: id },
                { $push: { "identify.gallery": new_image } }
            );
        }));
    };

    async insertComment(id, pet_id, data) {
        const user = await User.findById(id);

        const comment = {
            title: data,
            timestamp: Date.now(),
            user: user
        }
        await Post.findByIdAndUpdate(pet_id, { $push: { "feedback.comments": comment } })

        return comment;
    };

    async getUrlsImages(id) {
        return Post.aggregate([
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
    }
}

module.exports = PostServices;
