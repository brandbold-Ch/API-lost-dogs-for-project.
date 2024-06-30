const { ImageTools } = require("../utils/imageTools");
const { Blog } = require("../models/blog");
const { connection } = require("../config/connections");
const { User } = require("../models/user");
const { Rescuer } = require("../models/rescuer");
const { Association } = require("../models/association");
const mongoose = require("mongoose");


class BlogServices {

    constructor() {
        this.imageTools = new ImageTools();
    }

    async addGalleryToABlog(id, blog_id, images) {
        await Promise.all(images.map(async (key) => {
            let new_image = await this.imageTools.uploadImage(key["buffer"]);

            await Blog.updateOne(
                {
                    _id: blog_id,
                    user_id: id
                },
                {
                    $push: {
                        images: new_image
                    }
                }
            );
        }));
    }

    modelDetector(role) {
        switch (role) {
            case "USER":
                return ["User", User];

            case "RESCUER":
                return ["Rescuer", Rescuer];

            case "ASSOCIATION":
                return ["Association", Association]
        }
    }

    async setBlog(id, blog_data, role) {
        const session = await connection.startSession();
        const collection = this.modelDetector(role);
        const obj_data = blog_data[0];
        const array_images = blog_data[1];
        let output_blog;

        await session.withTransaction(async () => {
            await Blog.create([
                {
                    markdown_text: obj_data["markdown_text"],
                    doc_model: collection[0],
                    user_id: id
                }
            ], {session})
                .then((blog) => {
                    output_blog = blog[0];
                })

            await collection[1].updateOne(
                {
                    _id: id
                },
                {
                    $push: {
                        blogs_id: output_blog["_id"]
                    }
                }, {session}
            );
        })
            .then(() => {
                if (array_images.length) {
                    this.addGalleryToABlog(id, output_blog["_id"], array_images);
                }
            })

        await session.endSession();
        return output_blog;
    }

    async deletePartialGallery(id, blog_id, image_id) {
        const session = await connection.startSession();
        let output_update;

        await session.withTransaction(async () => {

            await Blog.updateOne(
                {
                    _id: blog_id,
                    user_id: id
                },
                {
                    $pull: {
                        images: {
                            id: image_id
                        }
                    }
                },
                {session}
            )
                .then((update) => {
                    output_update = update;
                });
        })
            .then(async () => {
                if (output_update["modifiedCount"] !== 0) {
                    await this.imageTools.deleteImages(image_id);
                }
            })

        await session.endSession();
    }

    async updateBlog(id, blog_id, blog_data) {
        const session = await connection.startSession();
        const obj_data = blog_data[0];
        const array_images = blog_data[1];
        let output_blog;

        await session.withTransaction(async () => {
            await Blog.findOneAndUpdate(
                {
                    _id: blog_id,
                    user_id: id
                },
                {
                    $set: {
                        markdown_text: obj_data["markdown_text"],
                        markers: {
                            update: Date.now()
                        }
                    }
                },
                {
                    new: true
                }
            ).session(session)
                .then((blog) => {
                    output_blog = blog;
                })
        })
            .then(() => {
                if (array_images.length) {
                    this.addGalleryToABlog(id, output_blog["_id"], array_images);
                }
            });

        await session.endSession();
        return output_blog;
    }

    async getBlogForGuest(blog_id) {
        return Blog.findById(blog_id);
    }

    async getBlog(id, blog_id) {
        return Blog.findOne({_id: blog_id, user_id: id});
    }

    async getBlogs(id) {
        return Blog.find({user_id: id}, {user_id: 0}).sort({"markers.timestamp": -1});
    }

    async deleteBlog(id, blog_id, role) {
        const session = await connection.startSession();
        const collection = this.modelDetector(role);
        let output_blog;

        await session.withTransaction(async () => {
            await Blog.findOneAndDelete(
                {
                    _id: blog_id,
                    user_id: id
                }, {session}
            )
                .then((blog) => {
                    output_blog = blog;
                })

            await collection[1].updateOne(
                {
                    _id: id
                },
                {
                    $pull: {
                        blogs_id: blog_id
                    }
                }, {session}
            );
        })
            .then(async () => {
                if (output_blog["images"].length) {
                    await this.imageTools.deleteGallery(output_blog["images"]);
                }
            });

        await session.endSession();
    }

    async getUrlsImages(id) {
        return Blog.aggregate([
            {
                $match: { user_id: new mongoose.Types.ObjectId(id) }
            },
            {
                $unwind: "$images"
            },
            {
                $group: {
                    _id: null,
                    allIds: { $push: "$images.id" }
                }
            },
            {
                $project: {
                    _id: 0,
                    allIds: 1
                }
            }
        ]);
    }
}

module.exports = {BlogServices}