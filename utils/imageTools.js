const { cloudinary } = require("../config/connections");


class ImageTools {

    constructor() {
    }

    async uploadImage(buffer) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: "auto"}, (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve({
                    url: result?.url,
                    id: result?.public_id
                });
            }).end(buffer);
        });
    }

    async deleteImages(images) {
        let value;

        if (images instanceof Array) {
            value = images;

        } else {
            value = [images];
        }

        await cloudinary.api.delete_resources(
            value, {type: 'upload', resource_type: 'image'}
        );
    }

    async deleteGallery(gallery) {
        if (gallery.length) {
            await cloudinary.api.delete_resources(
                gallery.map((obj) => {
                    return obj["id"];
                }),
                {
                    type: 'upload',
                    resource_type: 'image'
                }
            );
        }
    }
}

module.exports = { ImageTools };
