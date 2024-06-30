const { Request, Rescuer } = require('../models/rescuer');
const { Auth } = require('../models/auth');
const { Bulletin } = require("../models/bulletin");
const { Post } = require("../models/post");
const { Blog } = require("../models/blog");
const { PostServices } = require("../services/postServices");
const { BulletinServices } = require("../services/bulletinServices");
const { ImageTools } = require("../utils/imageTools");
const { connection } = require("../config/connections");
const { BlogServices } = require("./blogServices");


class RescuerServices {

    constructor() {
        this.posts = new PostServices();
        this.bulletins = new BulletinServices();
        this.blogs = new BlogServices();
        this.imageTools = new ImageTools();
    }

    async addImage(rescuer_id, image) {
        //await sharp(key["buffer"]).webp().toBuffer()

        if (image.length) {
            let new_image = await this.imageTools.uploadImage(image[0]["buffer"]);
            await Rescuer.updateOne({ _id: rescuer_id }, { $set: { image: new_image } });
        }
    }

    async deleteImage(id, image_id) {
        const session = await connection.startSession();
        let output_update;

        await session.withTransaction(async () => {
            await Rescuer.updateOne({ _id: id }, { $set: { image: null } }, { session })
                .then((update) => {
                    output_update = update;
                });
        })
            .then(async () => {
                if (output_update["modifiedCount"] !== 0) {
                    await this.imageTools.deleteImages(image_id);
                }
            });
    }

    async getRescuers() {
        return Rescuer.find({}, { posts_id: 0, bulletins_id: 0 })
            .populate("auth_id",  { email: 1, password: 1, _id: 0 })
            .populate("ext_relat", {name: 1, description: 1});
    }

    async createRescuer(rescuer_data) {
        const { name, email, password, social_networks, description } = rescuer_data[0];
        const image = rescuer_data[1];
        const session = await connection.startSession();
        let output_rescuer, output_auth;

        const socials = (social_networks)? Object.keys(social_networks).map(
            key => ({ [key]: social_networks[key] })
        ): undefined;

        await session.withTransaction(async () => {
            await Rescuer.create([{
                name: name,
                social_networks: socials,
                description: description
            }], { session })
                .then((rescuer) => {
                    output_rescuer = rescuer[0];
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user_id: output_rescuer["_id"],
                    role: "RESCUER",
                    doc_model: "Rescuer"
                }
            ], { session })
                .then((auth) => {
                    output_auth = auth[0];
                });

            await Request.create([{
                requested_role: "RESCUER",
                requester_role: "RESCUER",
                user_id: output_rescuer["_id"],
                doc_model: "Rescuer"
            }], { session });

            await Rescuer.updateOne(
                {
                    _id: output_rescuer["_id"]
                },
                {
                    $set: { auth_id: output_auth["_id"] }
                },
                {session}
            );
        })
            .then(async () => {
                await this.addImage(output_rescuer["_id"], image);
            });

        await session.endSession();
        return output_rescuer;
    }

    async getRescuer(id) {
        return Rescuer.findById(id, {
            posts_id: 0,
            blogs_id: 0,
            bulletins_id: 0
        })
            .populate("auth_id",
                { email: 1, password: 1, _id: 0 }
            )
    }

    async deleteSocialMedia(id, key, value) {
        await Rescuer.updateOne({ _id: id }, { $pull: { social_networks: { [key]: value } } });
    }

    async updateRescuer(id, rescuer_data) {
        const session = await connection.startSession();
        const { name, social_networks, description } = rescuer_data[0];
        const image = rescuer_data[1];
        let output_rescuer;
        const parsedNetworks = () => {
            if (social_networks) {
                const socials = JSON.parse(social_networks);
                return Object.keys(socials).map(
                    key => ({ [key]: socials[key] })
                );
            }
            return undefined;
        }

        await session.withTransaction(async () => {
            return Rescuer.findByIdAndUpdate(id,
                {
                    $set: {
                        name: name,
                        social_networks: parsedNetworks(),
                        description: description
                    }
                },
                {
                    runValidators: true,
                    new: true
                }
            ).session(session)
                .then((rescuer) => {
                    output_rescuer = rescuer;
                });
        })
            .then(async () => {
                await this.addImage(id, image);
            })

        await session.endSession();
        return output_rescuer;
    }

    async deleteRescuer(id) {
        const session = await connection.startSession();
        const array_urls_bulletins = await this.bulletins.getUrlsImages(id);
        const array_urls_posts = await this.posts.getUrlsImages(id);
        const array_urls_blogs = await this.blogs.getUrlsImages(id);
        const rescuer_image = await Rescuer.findById(id, { image: 1 });

        await session.withTransaction(async () => {
            await Promise.all([
                Request.deleteOne({ user_id: id }, { session }),
                Auth.deleteOne({ user_id: id }, { session }),
                Rescuer.deleteOne({ _id: id }, { session }),
                Bulletin.deleteMany({ user_id: id }, { session }),
                Post.deleteMany({ user_id: id }, { session }),
                Blog.deleteMany({ user_id: id }, { session })
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

                if (rescuer_image) {
                    await this.imageTools.deleteImages(rescuer_image["id"]);
                }
            })

        await session.endSession();
    }
}

module.exports = { RescuerServices }
