const {Request, Rescuer} = require('../models/rescuer');
const {Auth} = require('../models/auth');
const {Bulletin} = require("../models/bulletin");
const {Post} = require("../models/post");
const {Blog} = require("../models/blog");
const {PostServices} = require("../services/postServices");
const {BulletinServices} = require("../services/bulletinServices");
const {ImageTools} = require("../utils/imageTools");
const {connection} = require("../configurations/connections");
const {BlogServices} = require("./blogServices");


class RescuerServices {

    constructor() {
        this.posts = new PostServices();
        this.bulletins = new BulletinServices();
        this.blogs = new BlogServices();
        this.imageTools = new ImageTools();
    }

    async getRescuers() {
        return Rescuer.find({}, {posts: 0, bulletins: 0})
            .populate("auth",  {email: 1, password: 1, _id: 0});
    }

    async setRescuer(rescuer_data) {
        const {name, email, password, address, identifier, description} = rescuer_data;
        const session = await connection.startSession();
        let output_rescuer, output_auth;

        await session.withTransaction(async () => {

            await Rescuer.create([
                {
                    name: name,
                    address: address,
                    identifier: identifier,
                    description: description
                }
            ], {session})
                .then((collab) => {
                    output_rescuer = collab[0];
                });

            await Auth.create([
                {
                    email: email,
                    password: password,
                    user: output_rescuer["_id"],
                    role: ["RESCUER", "USER"],
                    doc_model: "Rescuer"
                }
            ], {session})
                .then((auth) => {
                    output_auth = auth[0];
                });

            await Request.create([
                {
                    role: ["RESCUER", "USER"],
                    email: email,
                    user: output_rescuer["_id"],
                    doc_model: "Rescuer"
                }
            ], {session});

            await Rescuer.updateOne(
                {
                    _id: output_rescuer["_id"]
                },
                {
                    $set: {
                        auth: output_auth["_id"]
                    }
                },
                {session}
            );
        });

        await session.endSession();
        return output_rescuer;
    }

    async getRescuer(id) {
        return Rescuer.findById(id)
            .populate("auth",
                {email: 1, password: 1, _id: 0}
            )
            .populate({
                path: "posts",
                options: {
                    sort: {
                        "publication.published": -1
                    }
                }
            })
            .populate({
                path: "bulletins",
                options: {
                    sort: {
                        "identify.timestamp": -1
                    }
                }
            })
            .populate({
                path: "blogs",
                options: {
                    sort: {
                        "markers.timestamp": -1
                    }
                }
            });
    }

    async updateRescuer(id, rescuer_data) {
        return Rescuer.findByIdAndUpdate(id,
            {
                $set: rescuer_data
            },
            {
                runValidators: true,
                new: true
            }
        );
    }

    async deleteRescuer(id) {
        const session = await connection.startSession();
        const array_urls_posts = await this.posts.getUrlsImages(id);
        const array_urls_bulletins = await this.bulletins.getUrlsImages(id);
        const array_urls_blogs = await this.blogs.getUrlsImages(id);

        await session.withTransaction(async () => {

            await Promise.all([
                Request.deleteOne({user: id}, {session}),
                Auth.deleteOne({user: id}, {session}),
                Rescuer.deleteOne({_id: id}, {session}),
                Bulletin.deleteMany({user: id}, {session}),
                Post.deleteMany({user: id}, {session}),
                Blog.deleteMany({user: id}, {session})
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
            })

        await session.endSession();
    }
}

module.exports = {RescuerServices};
