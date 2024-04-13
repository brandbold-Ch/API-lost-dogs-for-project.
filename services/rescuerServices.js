const {Request, Rescuer} = require('../models/rescuer');
const {Auth} = require('../models/auth');
const {Bulletin} = require("../models/bulletin");
const {Post} = require("../models/post");
const {PostServices} = require("../services/postServices");
const {BulletinServices} = require("../services/bulletinServices");
const {ImageTools} = require("../utils/imageTools");
const {connection} = require("../configurations/connections");


class RescuerServices {

    constructor() {
        this.posts = new PostServices();
        this.bulletins = new BulletinServices();
        this.imageTools = new ImageTools();
    }

    async getRescuers() {
        return Rescuer.find({});
    }

    async setRescuer(data) {
        const {name, email, password, address, identifier, description} = data;
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
                    user: output_rescuer["_id"]
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

        })
        await session.endSession();
    }

    async getRescuer(id) {
        return Rescuer.findById(id);
    }

    async updateRescuer(id, data) {
        await Rescuer.findByIdAndUpdate(id,
            {
                $set: data
            },
            {
                runValidators: true
            }
        );
    }

    async deleteRescuer(id) {
        const session = await connection.startSession();
        const array_urls_posts = await this.posts.getUrlsImages(id);
        const array_urls_bulletins = await this.bulletins.getUrlsImages(id);

        await session.withTransaction(async () => {

            await Promise.all([
                Request.deleteOne({user: id}, {session}),
                Auth.deleteOne({user: id}, {session}),
                Rescuer.deleteOne({_id: id}, {session}),
                Bulletin.deleteMany({user: id}, {session}),
                Post.deleteMany({user: id}, {session})
            ]);

        }).then(async () => {
            const array = array_urls_bulletins[0]["allIds"].concat(array_urls_posts[0]["allIds"]);
            await this.imageTools.deleteImages(array);

        }).catch((err) => {
            throw Error(err.message);
        })
        await session.endSession();
    }
}

module.exports = {RescuerServices};
