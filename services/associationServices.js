const { Request, Rescuer } = require('../models/rescuer');
const { Auth } = require('../models/auth');
const { Association } = require("../models/association");
const { Bulletin } = require("../models/bulletin");
const { Post } = require("../models/post");
const { Blog } = require("../models/blog");
const { PostServices} = require("../services/postServices");
const { BulletinServices} = require("../services/bulletinServices");
const { ImageTools } = require("../utils/imageTools");
const { connection } = require("../config/connections");
const { BlogServices } = require("./blogServices");


class AssociationServices {

    constructor() {
        this.posts = new PostServices();
        this.bulletins = new BulletinServices();
        this.blogs = new BlogServices();
        this.imageTools = new ImageTools();
    }

    async addImage(association_id, image) {
        //await sharp(key["buffer"]).webp().toBuffer()

        if (image.length) {
            let new_image = await this.imageTools.uploadImage(image[0]["buffer"]);
            await Association.updateOne({ _id: association_id }, { $set: { image: new_image } });
        }
    }

    async deleteImage(id, image_id) {
        const session = await connection.startSession();
        let output_update;

        await session.withTransaction(async () => {
            await Association.updateOne({ _id: id }, { $set: { image: null } }, { session })
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

    async createAssociation(association_data) {
        const { name, email, password, social_networks, description } = association_data[0];
        const image = association_data[1];
        const session = await connection.startSession();
        let output_association, output_auth;

        const socials = (social_networks)? Object.keys(social_networks).map(
            key => ({ [key]: social_networks[key] })
        ): undefined;

        await session.withTransaction(async () => {
            await Rescuer.create([{
                name: name,
                social_networks: socials,
                description: description
            }], { session })
                .then((association) => {
                    output_association = association[0];
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user_id: output_association["_id"],
                    role: "ASSOCIATION",
                    doc_model: "Association"
                }
            ], { session })
                .then((auth) => {
                    output_auth = auth[0];
                });

            await Association.updateOne(
                {
                    _id: output_association["_id"]
                },
                {
                    $set: { auth_id: output_auth["_id"] }
                },
                { session }
            );
        })
            .then(async () => {
                await this.addImage(output_association["_id"], image);
            });

        await session.endSession();
        return output_association;
    }

    async getAssociation(id) {
        return Association.findById(id, {
            posts_id: 0,
            blogs_id: 0,
            bulletins_id: 0,
            rescuers_id: 0
        })
            .populate("auth_id",
                { email: 1, password: 1, _id: 0 }
            )
    }

    async deleteSocialMedia(id, key, value) {
        await Association.updateOne({ _id: id }, { $pull: { social_networks: { [key]: value } } });
    }

    async updateAssociation(id, association_data) {
        const session = await connection.startSession();
        const { name, social_networks, description } = association_data[0];
        const image = association_data[1];
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
            return Association.findByIdAndUpdate(id,
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

    async deleteAssociation(id) {
        const session = await connection.startSession();
        const array_urls_bulletins = await this.bulletins.getUrlsImages(id);
        const array_urls_posts = await this.posts.getUrlsImages(id);
        const array_urls_blogs = await this.blogs.getUrlsImages(id);
        const rescuer_image = await Rescuer.findById(id, { image: 1 });

        await session.withTransaction(async () => {
            await Promise.all([
                Request.deleteOne({ user_id: id }, { session }),
                Auth.deleteOne({ user_id: id }, { session }),
                Association.deleteOne({ _id: id }, { session }),
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

    async addResCollab(id, rescuer_id) {
        const session = await connection.startSession();
        let output_association;

        await session.withTransaction(async () => {
            await Rescuer.updateOne(
                {
                    _id: rescuer_id
                },
                {
                    $set: { ext_relat: id }
                },
                { session }
            )

            await Association.findByIdAndUpdate(id,
                {
                    $addToSet: {
                        rescuers_id: rescuer_id
                    }
                },
                {
                    runValidators: true,
                    new: true
                }
                ).session(session)
                    .then((association) => {
                        output_association = association;
                    })
        });

        await session.endSession();
        return output_association;
    }

    async getRescuers(id) {
        return Rescuer.find({ ext_relat: id }, { posts_id: 0, bulletins_id: 0, blogs_id: 0 })
            .populate(
                "auth_id", { email: 1, password: 1, _id: 0 }
            );
    }
}

module.exports = { AssociationServices }