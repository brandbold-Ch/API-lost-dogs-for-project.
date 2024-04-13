const {Bulletin} = require("../models/bulletin");
const {Rescuer} = require("../models/rescuer");
const {User} = require("../models/user");
const {ImageTools} = require("../utils/imageTools");
const {connection} = require("../configurations/connections");
const mongoose = require("mongoose");


class BulletinServices {

    constructor() {
        this.imageTools = new ImageTools();
    }

    modelDetector(role) {
        switch (role[0]) {
            case "USER":
                return ["User", User];

            case "RESCUER":
                return ["Rescuer", Rescuer];
        }
    }

    async setBulletin(id, bulletin_data, role) {
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
                        address: obj_data["address"],
                        te_number: obj_data["te_number"],
                    },
                    user: id,
                    doc_model: collection[0]
                }
            ], {session})
                .then((bulletin) => {
                    output_bulletin = bulletin[0];
                });

            await collection[1].updateOne(
                {
                    _id: id
                },
                {
                    $push: {
                        bulletins: output_bulletin["_id"]
                    }
                },
                {session}
            );

        }).then(async () => {
            if (array_images) {

                await Promise.all(array_images.map(async (key) => {
                    const new_image = await this.imageTools.uploadImage(key["buffer"]);

                    if (key["fieldname"] === "image") {
                        await Bulletin.updateOne(
                            {
                                _id: output_bulletin["_id"]
                            },
                            {
                                $set: {
                                    "body.image": new_image
                                }
                            }
                        );

                    } else {
                        await Bulletin.updateOne(
                            {
                                _id: output_bulletin["_id"]
                            },
                            {
                                $push: {
                                    "body.gallery": new_image
                                }
                            }
                        );
                    }
                }));
            }

        }).catch((err) => {
            throw Error(err.message);
        })
        await session.endSession();

        return output_bulletin;
    }

    async deletePartialGallery(id, bulletin_id, img_id) {
        const session = await connection.startSession();

        await session.withTransaction(async () => {

            await Bulletin.deleteOne(
                {
                    _id: bulletin_id,
                    user: id
                },
                {
                    $pull: {
                        "body.gallery": {
                            id: img_id
                        }
                    }
                },
                {session}
            );

        }).then(async () => {
            await this.imageTools.deleteImages(img_id);

        }).catch((err) => {
            throw Error(err.message);
        })
        await session.endSession();
    }

    async getBulletins(id) {
        return Bulletin.find({user: id});
    }

    async getBulletin(id, bulletin_id) {
        return Bulletin.findOne({_id: bulletin_id, user: id});
    }

    async deleteBulletin(id, bulletin_id) {
        const session = await connection.startSession();
        let output_data;

        await session.withTransaction(async () => {

            await Bulletin.deleteOne(
                {
                    _id: bulletin_id,
                    user: id
                },
                {session}
            )
                .then((bulletin) => {
                    output_data = bulletin
                });

        }).then(async () => {

            await Promise.all([
                this.imageTools.deleteImages(output_data["body"]["image"]),
                this.imageTools.deleteGallery(output_data["body"]["gallery"])
            ]);

        }).catch((err) => {
            throw Error(err.message);
        })
        await session.endSession();
    }

    async updateBulletin(id, bulletin_id, bulletin_data) {
        const session = await connection.startSession();
        const context_bulletin = await Bulletin.findOne({_id: bulletin_id, user: id})
        const obj_data = bulletin_data[0];
        const array_images = bulletin_data[1];

        await session.withTransaction(async () => {
            await Bulletin.updateOne(
                {
                    _id: bulletin_id,
                    user: id
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
                            address: obj_data["address"],
                            te_number: obj_data["te_number"]
                        },
                        user: context_bulletin["user"]
                    }
                },
                {
                    runValidators: true
                },
                {session}
            )

        }).then(async () => {
            if (array_images) {
                await Promise.all(array_images.map(async (key) => {
                    const new_image = await this.imageTools.uploadImage(key["buffer"]);

                    if (key["fieldname"] === "image") {
                        await this.imageTools.deleteImages(context_bulletin["body"]["image"]);

                        await Bulletin.updateOne(
                            {
                                _id: bulletin_id,
                                user: id
                            },
                            {
                                $set: {
                                    "body.image": new_image
                                }
                            }
                        );

                    } else {
                        await Bulletin.updateOne(
                            {
                                _id: bulletin_id,
                                user: id
                            },
                            {
                                $push: {
                                    "body.gallery": new_image
                                }
                            }
                        );
                    }
                }));
            }

        }).catch((err) => {
            throw Error(err.message);

        })
        await session.endSession();
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
