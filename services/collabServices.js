const Collab = require('../models/collaborator');
const Auth = require('../models/auth');
const Request = require('../models/request');
const Bulletin = require("../models/bulletin")
const mongoose = require("mongoose");
const { cloudinary, conn } = require("../configurations/connections");


class CollabServices {

    constructor() {}

    async deleteImages(gallery) {
        if (gallery.length) {
            await cloudinary.api.delete_resources(
                gallery,
                { type: 'upload', resource_type: 'image' }
            );
        }
    }

    async getCollabs() {
        return Collab.find({});
    }

    async createCollab(data) {
        const { name, email, password, address, identifier, description } = data;
        const session = await conn.startSession();
        let output_data;

        await session.withTransaction(async () => {

            const collab = await Collab.create([
                {
                    name: name,
                    address: address,
                    identifier: identifier,
                    description: description
                }
            ], { session })
                .then((collab) => {
                    output_data = collab;
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user: collab[0]["_id"],
                    role: "COLLABORATOR"
                }
            ], { session });

            await Request.create([
                {
                    role: "COLLABORATOR",
                    user: collab[0]["_id"]
                }
            ], { session });

        });
        await session.endSession();
    }

    async getCollab(id) {
        return Collab.findById(id);
    }

    async updateCollab(id, data) {
        await Collab.findByIdAndUpdate(id,
            { $set: data },
            { runValidators: true }
        );
    }

    async deleteCollab(id) {
        const session = await conn.startSession();


        const array_urls = await Bulletin.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(id) }
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
                        $concatArrays:["$galleryIds", ["$imageId"]]
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

        await session.withTransaction(async () => {
            await Promise.all([
                Request.deleteOne({ user: id }, { session }),
                Auth.deleteOne({ user: id }, { session }),
                Collab.deleteOne({ _id: id }, { session }),
                Bulletin.deleteMany({ user: id }, { session })
            ]);

        }).then(async () => {

            if (array_urls.length) {
                await this.deleteImages(array_urls[0]["allIds"]);
            }

        }).catch((err) => {
            throw Error(err.message);
        })

        await session.endSession();
    }
}

module.exports = CollabServices;
