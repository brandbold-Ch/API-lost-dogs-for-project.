/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const User = require('../models/user');
const { cloudinary } = require('../configurations/config');

/**
 *Class that provides CRUD services related to lost pets.
 * @class
 */

class PetsServices {
    constructor() {
    };

    /**
     * Insert a lost pet into a user's lost pet list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {Object} pet_data - Pet data to insert.
     * @returns {Promise<void>} A Promise that will be resolved to the result of the insert operation.
     */

    async insertLostPet(id, pet_data) {
        if (pet_data.image) {
            let image;

            if (typeof pet_data.image === 'string'){
                image = pet_data.image;
            }
            else if (pet_data.image instanceof File) {
                const reader = new FileReader();
                reader.readAsDataURL(pet_data.image);
                console.log(pet_data.image);

                image = await new Promise((resolve) => {
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                });
            }

            console.log(image);
            await cloudinary.uploader.upload(image).then((url) => {
                pet_data.image = {
                    'url': url.url,
                    'id': url.public_id
                }
            });
        }

        if (pet_data.owner) {
            await User.updateOne(
                {_id: id},
                {$push: {my_lost_pets: pet_data}},
                {runValidators: true}
            );
        } else {
            await User.updateOne(
                {_id: id},
                {$push: {the_lost_pets: pet_data}},
                {runValidators: true}
            );
        }
    };

    /**
     * Gets the list of a user's lost pets.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param isOwner
     * @returns {Promise<{message: string}>} A Promise that will be resolved to the user's list of lost pets.
     */

    async getPosts(id, isOwner) {
        let tmp; let array;

        if (isOwner === 'true') {
            array = "my_lost_pets";
        }
        else if (isOwner === 'false') {
            array = "the_lost_pets";
        } else {
            return {'message': 'Illegal query, must be true or false'};
        }

        tmp = await User.findOne({_id: id}, {[`${array}`]: 1});
        return tmp[array];
    };

    /**
     * Gets a specific lost pet from a user's lost pet list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_name - Name of the pet to search for.
     * @returns {Promise<Array>} A Promise that will be resolved to the list of lost pets that match the specified name.
     */

    async getMiddlewareMyPost(id, pet_name) {
        return User.findOne(
            {_id: id},
            {my_lost_pets: {$elemMatch: {name: pet_name}}}
        );
    };

    /**
     * Gets a specific lost pet from another user's lost pet list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_name - Name of the pet to search for.
     * @returns {Promise<Array>} A Promise that will be resolved to the list of lost pets that match the specified name.
     */

    async getMiddlewareOtherPost(id, pet_name) {
        return User.findOne(
            {_id: id},
            {the_lost_pets: {$elemMatch: {name: pet_name}}}
        );
    };

    /**
     * Gets a user's lost pets by name.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_name - Name of the pet to search for.
     * @returns {Promise<Array>} A Promise that will be resolved to the list of lost pets that match the specified name.
     */

    async getMyPostByName(id, pet_name) {
        const myPet = await User.find(
            {_id: id, "my_lost_pets.name": pet_name},
        );
        return myPet[0].my_lost_pets;
    };

    /**
     * Gets another user's lost pets by name.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_name - Name of the pet to search for.
     * @returns {Promise<Array>} A Promise that will be resolved to the list of lost pets that match the specified name.
     */

    async getOtherPostByName(id, pet_name) {
        const otherPet = await User.find(
            {_id: id, "the_lost_pets.name": pet_name}
        );
        return otherPet[0].the_lost_pets;
    };

    /**
     * Gets a user's lost pet by ID.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet to retrieve.
     * @returns {Promise<Object>} A Promise that will be resolved to the lost pet with the specified ID.
     */

    async getMyPostById(id, pet_id) {
        const myPet = await User.findOne(
            {_id: id},
            {my_lost_pets: {$elemMatch: {_id: pet_id}}}
        );
        return myPet['my_lost_pets'][0];
    };

    /**
     * Gets another user's lost pet by ID.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet to retrieve.
     * @returns {Promise<Object>} A Promise that will be resolved to the lost pet with the specified ID.
     */

    async getOtherPostById(id, pet_id) {
        const otherPet = await User.findOne(
            {_id: id},
            {the_lost_pets: {$elemMatch: {_id: pet_id}}}
        );
        return otherPet['the_lost_pets'][0];
    };

    /**
     * Removes a lost pet from a user's lost pet list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - Name of the pet to remove.
     * @returns {Promise<void>}
     */

    async delMyPost(id, pet_id) {
        const myPet = await User.findOne(
            {_id: id},
            {my_lost_pets: {$elemMatch: {_id: pet_id}}}
        );

        if (myPet['my_lost_pets'][0].image !== '') {
            await cloudinary.uploader.destroy(myPet['my_lost_pets'][0].image.id)
        }

        await User.updateOne(
            {_id: id},
            {$pull: {my_lost_pets: {_id: pet_id}}}
        );
    };

    /**
     * Removes a lost pet from another user's lost pet list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet to remove.
     * @returns {Promise<void>}
     */

    async delOtherPost(id, pet_id) {
        const otherPet = await User.findOne(
            {_id: id},
            {the_lost_pets: {$elemMatch: {_id: pet_id}}}
        );

        if (otherPet['the_lost_dogs'][0].image !== '') {
            await cloudinary.uploader.destroy(otherPet['the_lost_pets'][0].image.id)
        }

        await User.updateOne(
            {_id: id},
            {$pull: {the_lost_pets: {_id: pet_id}}}
        );
    }

    /**
     * Updates the information of a lost pet in a user's lost pet list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - Name of the pet to update.
     * @param {Object} pet_data - New pet data.
     * @returns {Promise<void>}
     */

    async updateMyPost(id, pet_id, pet_data) {
        const pet = await this.getMyPostById(id, pet_id)
        pet_data.tags = pet.tags;
        pet_data._id = pet._id;
        pet_data.date = pet.date;
        pet_data.update = Date.now();

        if (typeof pet.image === "object" && pet_data.image.substring(11, 21) !== "cloudinary") {
            await cloudinary.uploader.destroy(pet.image.id);
            const url = await cloudinary.uploader.upload(pet_data.image);
            pet_data.image = {
                'url': url.url,
                'id': url.public_id
            };

        }
        else if (pet_data.image.substring(11, 21) === "cloudinary") {
            pet_data.image = pet.image;

        } else {
            const url = await cloudinary.uploader.upload(pet_data.image);
            pet_data.image = {
                'url': url.url,
                'id': url.public_id
            };
        }

        await User.updateOne(
            {_id: id, "my_lost_pets._id": pet_id},
            {$set: {"my_lost_pets.$": pet_data}},
            {runValidators: true}
        );
    };

    /**
     * Updates the information of a lost pet in another user's lost pet list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet to update.
     * @param {Object} pet_data - New pet data.
     * @returns {Promise<void>}
     */

    async updateOtherPost(id, pet_id, pet_data) {
        const pet = await this.getOtherPostById(id, pet_id)
        pet_data.tags = pet.tags;
        pet_data["_id"] = pet._id;
        pet_data.date = pet.date;
        pet_data["update"] = Date.now();

        if (typeof pet.image === "object" && pet_data.image.substring(11, 21) !== "cloudinary") {
            await cloudinary.uploader.destroy(pet.image.id);
            const url = await cloudinary.uploader.upload(pet_data.image);
            pet_data.image = {
                'url': url.url,
                'id': url.public_id
            };

        } else if (pet_data.image.substring(11, 21) === "cloudinary") {
            pet_data.image = pet.image;

        } else {
            const url = await cloudinary.uploader.upload(pet_data.image);
            pet_data.image = {
                'url': url.url,
                'id': url.public_id
            };
        }

        await User.updateOne(
            {_id: id, "the_lost_pets._id": pet_id},
            {$set: {"the_lost_pets.$": pet_data}},
            {runValidators: true}
        );
    };

    /**
     * Inserts tags into a user's lost pet.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet.
     * @param {Object} data - Tags data.
     * @returns {Promise<void>}
     */

    async insertTagsMyPost(id, pet_id, data) {
        await User.updateOne(
            {_id: id, "my_lost_pets._id": pet_id},
            {$push: {"my_lost_pets.$.tags": data}}
        );
    };

    /**
     * Inserts tags into another user's lost pet.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet.
     * @param {Object} data - Tags data.
     * @returns {Promise<void>}
     */

    async insertTagsOtherPost(id, pet_id, data) {
        await User.updateOne(
            {_id: id, "the_lost_pets._id": pet_id},
            {$push: {"the_lost_pets.$.tags": data}}
        );
    };

    /**
     * Deletes tags from a user's lost pet.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet.
     * @param {string} key - Key of the tag to delete.
     * @param {string} tag_value - Value of the tag to delete.
     * @returns {Promise<void>}
     */

    async delTagsMyPost(id, pet_id, key, tag_value) {
        await User.updateOne(
            {_id: id, "my_lost_pets._id": pet_id},
            {$pull: {"my_lost_pets.$.tags": {[key]: tag_value}}}
        );
    };

    /**
     * Deletes tags from another user's lost pet.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet.
     * @param {string} key - Key of the tag to delete.
     * @param {string} tag_value - Value of the tag to delete.
     * @returns {Promise<void>}
     */

    async delTagsOtherPost(id, pet_id, key, tag_value) {
        await User.updateOne(
            {_id: id, "the_lost_pets._id": pet_id},
            {$pull: {"the_lost_pets.$.tags": {[key]: tag_value}}}
        );
    };
}

module.exports = PetsServices;
