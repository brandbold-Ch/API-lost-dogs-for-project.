const {ImageTools} = require("../utils/imageTools");
const {Blog} = require("../models/blog");
const {connection} = require("../configurations/connections");
const {User} = require("../models/user");
const {Rescuer} = require("../models/rescuer");


class BlogServices {

    constructor() {
        this.imageTools = ImageTools();
    }

    async addGalleryToABlog(id, blog_id, images) {
        await Promise.all(images.map(async (key) => {
            let new_image = await this.imageTools.uploadImage(key["buffer"]);

            await Blog.updateOne(
                {
                    _id: blog_id,
                    user: id
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
        switch (role[0]) {
            case "USER":
                return ["User", User];

            case "RESCUER":
                return ["Rescuer", Rescuer];
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
                    doc_model: collection[0]
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
                        blogs: output_blog["_id"]
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
                    user: id
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

        })

    }
}