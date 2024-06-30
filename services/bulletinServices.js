const { Bulletin } = require("../models/bulletin");
const { Rescuer } = require("../models/rescuer");
const { User } = require("../models/user");
const { ImageTools } = require("../utils/imageTools");
const { connection } = require("../config/connections");
const mongoose = require("mongoose");


class BulletinServices {

    constructor() {
        this.imageTools = new ImageTools();
    }

    async addGalleryToBulletin(id, bulletin_id, images) {
        await Promise.all(images.map(async (key) => {
            let new_image = await this.imageTools.uploadImage(key["buffer"]);
            let chunk;

            if (key["fieldname"] === "image") {
                chunk = { $set: { "body.image": new_image } };

            } else {
                chunk = { $push: { "body.gallery": new_image } };
            }

            await Bulletin.updateOne({ _id: bulletin_id, user_id: id }, chunk);
        }));
    };

    modelDetector(role) {
        switch (role) {
            case "USER":
                return ["User", User];

            case "RESCUER":
                return ["Rescuer", Rescuer];

            case "ASSOCIATION":
                return ["Association", Rescuer];
        }
    }

    async createBulletin(id, bulletin_data, role) {
        const session = await connection.startSession();
        const collection = this.modelDetector(role);
        const obj_data = bulletin_data[0];
        const array_images = bulletin_data[1];
        let output_bulletin;

        await session.withTransaction(async () => {

            await Bulletin.create([
                {
                    title: obj_data["title"],
                    body: {
                        text: obj_data["text"]
                    },
                    identify: {
                        name_company: obj_data["name_company"],
                        phone_number: obj_data["te_number"],
                    },
                    user_id: id,
                    doc_model: collection[0]
                }
            ], { session })
                .then((bulletin) => {
                    output_bulletin = bulletin[0];
                });

            await collection[1].updateOne(
                {
                    _id: id
                },
                {
                    $push: {
                        bulletins_id: output_bulletin["_id"]
                    }
                }, { session }
            );

        })
            .then(async () => {
                if (array_images.length) {
                    await this.addGalleryToBulletin(id, output_bulletin["_id"], array_images);
                }
            })

        await session.endSession();
        return output_bulletin;
    }

    async deleteImageGallery(id, bulletin_id, queries) {
        const session = await connection.startSession();
        let output_update, chunk, selector;

        if (queries["tag"] === "image") {
            selector = { "body.image.id": queries["id"] };
            chunk = { $set: { "body.image": null } };

        } else {
            selector = {"body.gallery.id": queries["id"]};
            chunk = { $pull: { "body.gallery": { id: queries["id"] } } };
        }

        await session.withTransaction(async () => {

            await Bulletin.updateOne(
                {
                    _id: bulletin_id,
                    user_id: id,
                    ...selector
                },
                chunk,
                { session }
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

    async getBulletins(id) {
        return Bulletin.find({ user_id: id }).sort({"identify.timestamp": -1});
    }

    async getBulletin(id, bulletin_id) {
        return Bulletin.findOne({ _id: bulletin_id, user_id: id });
    }

    async getBulletinForGuest(bulletin_id) {
        return Bulletin.findById(bulletin_id);
    }

    async deleteBulletin(id, bulletin_id, role) {
        const session = await connection.startSession();
        const collection = this.modelDetector(role);
        let output_data;

        await session.withTransaction(async () => {

            await Bulletin.findOneAndDelete(
                {
                    _id: bulletin_id,
                    user_id: id
                },
                {session}
            )
                .then((bulletin) => {
                    output_data = bulletin;
                });

            await collection[1].updateOne(
                {
                    _id: id
                },
                {
                    $pull: {
                        bulletins_id: bulletin_id
                    }
                }, {session}
            );
        })
            .then(async () => {
                if (output_data["body"]["image"]) {
                   await this.imageTools.deleteImages(output_data["body"]["image"]["id"]);
                }

                if (output_data["body"]["gallery"].length) {
                   await this.imageTools.deleteGallery(output_data["body"]["gallery"]);
                }
            })

        await session.endSession();
    }

    async updateBulletin(id, bulletin_id, bulletin_data) {
        const session = await connection.startSession();
        const context_bulletin = await Bulletin.findOne({_id: bulletin_id, user_id: id});
        const obj_data = bulletin_data[0];
        const array_images = bulletin_data[1];
        let output_bulletin;

        await session.withTransaction(async () => {

            await Bulletin.findOneAndUpdate(
                {
                    _id: bulletin_id,
                    user_id: id
                },
                {
                    $set: {
                        title: obj_data["title"],
                        body: {
                            image: context_bulletin["body"]["image"],
                            text: obj_data["text"],
                            gallery: context_bulletin["body"]["gallery"]
                        },
                        identify: {
                            name_company: obj_data["name_company"],
                            phone_number: obj_data["te_number"],
                            timestamp: context_bulletin["identify"]["timestamp"],
                            update: Date.now()
                        },
                        user_id: context_bulletin["user"]
                    }
                },
                {
                    runValidators: true,
                    new: true
                }
            ).session(session)
                .then((bulletin) => {
                    output_bulletin = bulletin;
                })

        })
            .then(async () => {
                if (array_images.length) {
                    await this.addGalleryToBulletin(id, output_bulletin["_id"], array_images);
                }
            })

        await session.endSession();
        return output_bulletin;
    }

    async getUrlsImages(id) {
        return Bulletin.aggregate([
            {
                $match: {user: new mongoose.Types.ObjectId(id)}
            },
            {
                $project: {
                    "_id": 0,
                    "imageId": "$body.image.id",
                    "galleryIds": "$body.gallery.id"
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
                    "allIds": {
                        $addToSet: "$allIds"
                    }
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

module.exports = {BulletinServices};
