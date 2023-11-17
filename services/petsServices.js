/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const { User } = require('../models/user');
const Pet = require('../models/pets');
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
    }

     async deleteImage(id) {
         await cloudinary.uploader.destroy(id);
     }

     async delPartialGallery(id, pet_id, img_id) {
        await this.deleteImage(img_id);
        await Pet.updateOne(
            { _id: pet_id, user: id},
            { $pull: { "identify.gallery": { id: img_id }}}
        );
     }

    async postsAll(id) {
        return Pet.find({ user: id });
    }

    async getGeneralPost(pet_id) {
        return Pet.findById(pet_id);
    }

    async getPost(id, pet_id) {
        return Pet.findOne({ _id: pet_id, user: id });
    };

    async insertLostPet(id, pet_data) {
        const body = pet_data[0];
        const file = pet_data[1];

        let template = {
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
                coordinates: body.coordinates
            },
            status: {
                owner: body.owner
            },
            identify: {
                image: await this.uploadImage(file.buffer)
            }
        };

        const user = await User.findById(id, { __v: 0 });
        const pet = new Pet({...template, user: user['_id']});

        await pet.save();
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

        if (pet['identify'].image) {
            await this.deleteImage(pet['identify'].image.id);
        }

        if (pet['identify'].gallery.length) {
            for (const key of pet['identify'].gallery) {
                await this.deleteImage(key.id);
            }
        }

        await Pet.deleteOne({ _id: pet_id, user: id });
    };


    async updatePost(id, pet_id, pet_data) {
        const context = await this.getPost(id, pet_id);

        const body = pet_data[0];
        const file = pet_data[1];

        let template = {
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
                coordinates: body.coordinates,
                update: Date.now(),
                published: context['publication'].published,
            },
            status: {
                owner: body.owner,
                found: body.found
            },
            identify: {
                image: context['identify'].image,
                gallery: context['identify'].gallery
            },
            feedback: {
                comments: context['feedback'].comments,
                tags: context['feedback'].tags
            },
        }

        if (file !== undefined) {
            await this.deleteImage(context['identify'].image.id);
            template.identify.image = await this.uploadImage(file.buffer);
        }

        await Pet.updateOne(
            { _id: pet_id, user: id },
            { $set: template },
            { runValidators: true }
        );
    }

    async addGallery(id, pet_id, images) {
        images.map(async (key) => {
            let image = await this.uploadImage(key.buffer);
            await Pet.updateOne(
                { _id: pet_id, user: id },
                { $push: { "identify.gallery": image } }
            );
        });
    };

    async insertTagsPost(id, pet_id, data) {
        await Pet.updateOne(
            { _id: pet_id, user: id},
            { $push: { "feedback.tags": data } }
        );
    };

    async delTagsPost(id, pet_id, key, value) {
        await Pet.updateOne(
            { _id: pet_id, user: id },
            { $pull: { "feedback.tags": { [key]: value } } }
        );
    };

    async insertComment(id, pet_id, data) {
        const user = await User.findById(id,
            {
                lastname: 0,
                cellphone: 0,
                __v: 0,
                _id: 1,
                social_media: 0
            }
        );

        const comment = {
            title: data,
            timestamp: new Date(Date.now()),
            user: user
        };

        await Pet.findByIdAndUpdate(pet_id,
            { $push: { "feedback.comments": comment }}
        );
    };
}

module.exports = PetsServices;
