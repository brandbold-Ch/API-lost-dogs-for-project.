/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const User = require('../models/user');
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

    async posts(id) {
        return User.aggregate([
            {
                $match: { _id: new ObjectId(id) }
            },
            {
                $unwind: '$lost_pets'
            },
            {
                $replaceRoot: { newRoot: '$lost_pets' }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    details: 1,
                    publication: 1,
                    status: 1,
                    identify: 1,
                    feedback: 1
                }
            }
        ]);
    }

    async getPet(id, pet_id) {
        return User.findOne(
            {_id: id},
            {lost_pets: {$elemMatch: {_id: pet_id}}}
        );
    };

    async getGallery(id, pet_id) {
        return User.findOne(
            {_id: id},
            {"lost_pets": {$elemMatch: {"identify.gallery": 1}}}
        );
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
        }

        await User.updateOne(
            {_id: id},
            {$push: {lost_pets: data}},
            {runValidators: true}
        );
    };

    async getPosts(id) {
        return await this.posts(id);
    };

    async getFilterPostGender(id, gender) {
        const array = await this.posts(id);
        return array.filter(key => key.details.gender === gender);
    };

    async getFilterPostBreed(id, breed) {
        const array = await this.posts(id);
        return array.filter(key => key.details.breed === breed);
    };

    async getFilterPostSize(id, size) {
        const array = await this.posts(id);
        return array.filter(key => key.details.size === size);
    };

    async getFilterPostOwner(id, owner) {
        const array = await this.posts(id);
        return array.filter(key => key.status.owner === JSON.parse(owner));
    };

    async getFilterPostFound(id, found) {
        const array = await this.posts(id);
        return array.filter(key => key.status.found === JSON.parse(found));
    };

    async getFilterPostSpecie(id, specie) {
        const array = await this.posts(id);
        return array.filter(key => key.details.specie === specie);
    };

    async delPost(id, pet_id) {
        const pet = await this.getPet(id, pet_id);

        if (pet['lost_pets'][0].identify.image !== null) {
            await this.deleteImage(pet['lost_pets'][0].identify.image.id);
        }

        await User.updateOne(
            {_id: id},
            {$pull: {lost_pets: {_id: pet_id}}}
        );
    };


    async updatePost(id, pet_id, pet_data) {
        const pet = await this.getPet(id, pet_id);
        const context = pet['lost_pets'][0];

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
            {_id: id, "lost_pets._id": pet_id},
            {$set: {"lost_pets.$": data}},
        );
    };

    async addGallery(id, pet_id, images) {
        console.log(images);
        images.map(async (key) => {
            console.log(key);
            let image = await this.uploadImage(key.buffer);
            await User.updateOne(
                {_id: id, "lost_pets._id": pet_id},
                {$push: {"lost_pets.$.identify.gallery": image}}
            );
        });
    };

    async insertTagsPost(id, pet_id, data) {
        await User.updateOne(
            {_id: id, "lost_pets._id": pet_id},
            {$push: {"lost_pets.$.feedback.tags": data}}
        );
    };

    async delTagsPost(id, pet_id, key, value) {
        await User.updateOne(
            {_id: id, "lost_pets._id": pet_id},
            {$pull: {"lost_pets.$.feedback.tags": {[key]: value}}}
        );
    };
}

module.exports = PetsServices;
