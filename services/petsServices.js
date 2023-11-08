/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const { User } = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { cloudinary } = require('../configurations/config');

/**
 *Class that provides CRUD services related to lost pets.
 * @class
 */

class PetsServices {

    constructor() {};

     async uploadImage(buffer) {
         return new Promise((resolve, reject) => {
             cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                 if (error) {
                     reject(error);
                 } else {
                     resolve({
                         url: result.url,
                         id: result.public_id
                     });
                 }
             }).end(buffer);
         });
    };

     async deleteImage(id) {
         await cloudinary.uploader.destroy(id);
     };

     async delPartialGallery(id, pet_id, img_id) {
        await this.deleteImage(img_id);
        await User.updateOne(
            {
                _id: id,
                "lost_pets._id": pet_id
            },
            {
                $pull: {
                    "lost_pets.$.identify.gallery": {
                        id: img_id
                    }
                }
            }
        );
     }

    async postsAll(id) {
        return User.aggregate([
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            {
                $unwind: '$lost_pets'
            },
            {
                $replaceRoot: {
                    newRoot: '$lost_pets'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    details: 1,
                    publication: 1,
                    status: 1,
                    'identify.image': 1,
                    feedback: 1
                }
            }
        ]);
    }

    async getPost(id, pet_id) {
        const pet = await User.findOne(
            {
                _id: id
            },
            {
                lost_pets: {
                    $elemMatch: {
                        _id: pet_id
                    }
                }
            }
        );

        return pet['lost_pets'][0];
    };

    async insertLostPet(id, pet_data) {
        const body = pet_data[0];
        const file = pet_data[1];

        let data = {
            name: body.name,
            details: {
                specie: body.specie,
                gender: body.gender,
                age: body.age,
                description: body.description,
                size: body.size,
                breed: body.breed
            },
            publication: {
                lost_date: body.lost_date,
                last_seen_site: body.last_seen_site
            },
            status: {
                owner: body.owner
            },
            identify: {
                image: await this.uploadImage(file.buffer)
            }
        };

        await User.updateOne(
            {
                _id: id
            },
            {
                $push: {
                    lost_pets: data
                }
            },
            {
                runValidators: true
            }
        );
    };

    async getPosts(id) {
        return await this.postsAll(id);
    };

    async getFilterPostGender(id, gender) {
        const array = await this.postsAll(id);
        return array.filter(key => key.details.gender === gender);
    };

    async getFilterPostBreed(id, breed) {
        const array = await this.postsAll(id);
        return array.filter(key => key.details.breed === breed);
    };

    async getFilterPostSize(id, size) {
        const array = await this.postsAll(id);
        return array.filter(key => key.details.size === size);
    };

    async getFilterPostOwner(id, owner) {
        const array = await this.postsAll(id);
        return array.filter(key => key.status.owner === JSON.parse(owner));
    };

    async getFilterPostFound(id, found) {
        const array = await this.postsAll(id);
        return array.filter(key => key.status.found === JSON.parse(found));
    };

    async getFilterPostSpecie(id, specie) {
        const array = await this.postsAll(id);
        return array.filter(key => key.details.specie === specie);
    };

    async delPost(id, pet_id) {
        const pet = await this.getPost(id, pet_id);

        if (pet.identify.image !== null) {
            await this.deleteImage(pet.identify.image.id);
        }

        if (pet.identify.gallery.length) {
            for (const key of pet) {
                await this.deleteImage(key.id)
            }
        }

        await User.updateOne(
            {
                _id: id
            },
            {
                $pull: {
                    lost_pets: {
                        _id: pet_id
                    }
                }
            }
        );
    };


    async updatePost(id, pet_id, pet_data) {
        const context = await this.getPost(id, pet_id);

        const body = pet_data[0];
        const file = pet_data[1];

        let data = {
            name: body.name,
            details: {
                specie: body.specie,
                gender: body.gender,
                age: body.age,
                description: body.description,
                size: body.size,
                breed: body.breed
            },
            publication: {
                lost_date: body.lost_date,
                last_seen_site: body.last_seen_site,
                update: Date.now(),
                published: context.publication.published,
            },
            status: {
                owner: body.owner,
                found: body.found
            },
            identify: {
                image: context.identify.image,
                gallery: context.identify.gallery
            },
            feedback: {
                comments: context.feedback.comments,
                tags: context.feedback.tags
            },
            _id: context._id
        }

        if (file !== undefined) {
            await this.deleteImage(context.identify.image.id);
            data.identify.image = await this.uploadImage(file.buffer);
        }

        await User.updateOne(
            {
                _id: id,
                "lost_pets._id": pet_id
            },
            {
                $set: {
                    "lost_pets.$": data
                }
            },
            {runValidators: true}
        );
    };

    async addGallery(id, pet_id, images) {
        console.log(images);
        images.map(async (key) => {
            console.log(key);
            let image = await this.uploadImage(key.buffer);
            await User.updateOne(
                {
                    _id: id,
                    "lost_pets._id": pet_id
                },
                {
                    $push: {
                        "lost_pets.$.identify.gallery": image
                    }
                }
            );
        });
    };

    async insertTagsPost(id, pet_id, data) {
        await User.updateOne(
            {
                _id: id,
                "lost_pets._id": pet_id
            },
            {
                $push: {
                    "lost_pets.$.feedback.tags": data
                }
            }
        );
    };

    async delTagsPost(id, pet_id, key, value) {
        await User.updateOne(
            {
                _id: id,
                "lost_pets._id": pet_id
            },
            {
                $pull: {
                    "lost_pets.$.feedback.tags": {
                        [key]: value
                    }
                }
            }
        );
    };

    async insertComment(id, user_id, pet_id, data) {
        const user = await User.findOne(
            {
                _id: id
            },
            {
                lastname: 0,
                cellphone: 0,
                __v: 0,
                _id: 1,
                lost_pets: 0,
                social_media: 0
            }
        );

        const comment = {
            title: data,
            timestamp: new Date(Date.now()),
            user: user
        };

        await User.updateOne(
            {
                _id: user_id,
                "lost_pets._id": pet_id
            },
            {
                $push: {
                    "lost_pets.$.feedback.comments": comment
                }
            }
        );
    };
}

module.exports = PetsServices;
