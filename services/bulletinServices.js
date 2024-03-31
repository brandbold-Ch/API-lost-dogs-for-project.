const Bulletin = require("../models/bulletin");
const Collab = require("../models/collaborator");
const { cloudinary, conn } = require("../configurations/connections");


class BulletinServices {

    constructor() {};

    async deleteImage(img_id) {
        if (img_id) {
            await cloudinary.api.delete_resources(
                [img_id], { type: 'upload', resource_type: 'image' }
            );
        }
    }

    async uploadImage(buffer) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: "auto"}, (error, result) => {
                if (error) { reject(error); }
                resolve({
                    url: result?.url,
                    id: result?.public_id
                });
            }).end(buffer);
        });
    }

    async createBulletin(id, bulletin_data) {
        const session = await conn.startSession();
        const collab_ref = await Collab.findById(id);
        const obj_data = bulletin_data[0];
        const array_images = bulletin_data[1];
        let output_data;

        await session.withTransaction(async () => {
            await Bulletin.create([
                {
                    title: obj_data["title"],
                    body: {
                        image: null,
                        text: obj_data["text"]
                    },
                    identify: {
                        name_company: obj_data["name_company"],
                        address: obj_data["address"],
                        te_number: obj_data["te_number"],
                    },
                    user: collab_ref["_id"]
                }
            ], { session })
                .then((bulletin) => {
                    output_data = bulletin;
                });

        }).then(async () => {
            if (array_images) {
                const parsed_data = output_data[0];

                await Promise.all(array_images.map(async (key) => {
                    const new_image = await this.uploadImage(key["buffer"]);
                    if (key["fieldname"] === "image") {
                        await Bulletin.updateOne(
                            { _id: parsed_data["_id"] },
                            { $set: {"body.image": new_image } }
                        );
                    }
                    else {
                        await Bulletin.updateOne(
                            { _id: parsed_data["_id"] },
                            { $push: { "body.gallery": new_image } }
                        );
                    }
                }));
            }

        }).catch((err) => {
            throw Error(err.message);
        })
        await session.endSession();
    }

    async deletePartialGallery(id, bulletin_id, img_id) {
        const session = await conn.startSession();

        await session.withTransaction(async () => {
            await Bulletin.updateOne({ _id: bulletin_id, user: id},
                { $pull: { "body.gallery": { id: img_id }}},
                { session }
            );

        }).then(async () => {
            await this.deleteImage(img_id);

        }).catch((err) => {
            throw Error(err.message);
        })
        await session.endSession();
    }

    async getBulletins(id) {
        return Bulletin.find({ user: id });
    }

    async getBulletin(id, bulletin_id) {
        return Bulletin.findOne({ _id: bulletin_id, user: id });
    }

    async deleteBulletin(id, bulletin_id) {
        const session = await conn.startSession();
        let output_data;

        await session.withTransaction(async () => {

            await Bulletin.findOneAndDelete(
                { _id: bulletin_id, user: id }, { session }

            ).then((bulletin) => {
                output_data = bulletin
            });

        }).then(async () => {

            if (output_data["body"]["image"]) {
                await this.deleteImage(output_data["body"]["image"]["id"]);
            }

            if (output_data["body"]["gallery"].length) {
                output_data["body"]["gallery"].map(async (key) => {
                    await this.deleteImage(key["id"]);
                });
            }

        }).catch((err) => {
            throw Error(err.message);
        })
        await session.endSession();
    }

    async updateBulletin(id, bulletin_id, bulletin_data) {
        const session = await conn.startSession();
        const context_bulletin = await Bulletin.findOne({ _id: bulletin_id, user: id })
        const obj_data = bulletin_data[0];
        const array_images = bulletin_data[1];

        await session.withTransaction(async () => {
            await Bulletin.updateOne(
                { _id: bulletin_id, user: id },
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
                { session }
            )

        }).then(async () => {
            if (array_images) {
                await Promise.all(array_images.map(async (key) => {
                    const new_image = await this.uploadImage(key["buffer"]);
                    
                    if (key["fieldname"] === "image") {
                        await this.deleteImage(context_bulletin["body"]["image"]["id"]);
                        await Bulletin.updateOne(
                            { _id: bulletin_id, user: id },
                            { $set: {"body.image": new_image } }
                        );

                    } else {
                        await Bulletin.updateOne(
                            { _id: bulletin_id, user: id},
                            { $push: { "body.gallery": new_image } }
                        );
                    }
                }));
            }

        }).catch((err) => {
            throw Error(err.message);
            
        })
        await session.endSession();
    }
}

module.exports = BulletinServices;
