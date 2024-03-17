const Bulletin = require("../models/bulletin");
const Collab = require("../models/collaborator");
const { cloudinary } = require("../configurations/config_extra");
const conn = require("../configurations/connection");
const Post = require("../models/post");


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
                    url: result["url"],
                    id: result["public_id"]
                });
            }).end(buffer);
        });
    }

    async addGallery(id, pet_id, images) {
        await Promise.all(images.map(async (key) => {
            let new_image = await this.uploadImage(key.buffer);

            await Post.updateOne(
                { _id: pet_id, user: id },
                { $push: { "identify.gallery": new_image } }
            );
        }));
    };

    async createBulletin(id, bulletin_data) {
        const session = await conn.startSession();
        const collab_ref = await Collab.findById(id);
        const obj_data = bulletin_data[0];
        const obj_image = bulletin_data[1];
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
                if (obj_image) {
                    const new_image = await this.uploadImage(obj_image["buffer"]);
                    const parsed_data = JSON.parse(JSON.stringify(output_data[0]))

                    await Bulletin.updateOne(
                        { _id: parsed_data["_id"] },
                        { $set: {"body.image": new_image } }
                    );
                }
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
            await this.deleteImage(output_data["body"]["image"]["id"])
        })
        await session.endSession();
    }

    async updateBulletin(id, bulletin_id, bulletin_data) {
        const session = await conn.startSession();
        const context_bulletin = await Bulletin.findOne({ _id: bulletin_id, user: id })
        const obj_data = bulletin_data[0];
        const obj_image = bulletin_data[1];


        await session.withTransaction(async () => {
            await Bulletin.updateOne(
                { _id: bulletin_id, user: id },
                {
                    $set: {
                        title: obj_data["title"],
                        body: {
                            image: context_bulletin["body"]["image"],
                            text: obj_data["text"]
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
        }).then(async (bulletin) => {
                if (obj_image) {
                    await this.deleteImage(context_bulletin["body"]["image"]["id"]);
                    const new_image = await this.uploadImage(obj_image["buffer"]);

                    await Bulletin.updateOne(
                        { _id: bulletin_id, user: id },
                        { $set: { "body.image": new_image } }
                    );
                }
        }).catch((err) => {
                throw Error(err.message);
        })
        await session.endSession();
    }
}

module.exports = BulletinServices;
