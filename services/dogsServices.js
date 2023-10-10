/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to authenticated users
 */

const User = require('../models/user');
const { cloudinary } = require('../configurations/config');

/**
 *Class that provides CRUD services related to lost dogs.
 * @class
 */

class DogsServices {
    constructor() {
    };

    /**
     * Insert a lost dog into a user's lost dog list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {Object} dog_data - Dog data to insert.
     * @returns {Promise<void>} A Promise that will be resolved to the result of the insert operation.
     */

    async insertLostDog(id, dog_data) {
        if (dog_data.image) {
            await cloudinary.uploader.upload(dog_data.image).then((url) => {
                dog_data.image = {
                    'url': url.url,
                    'id': url.public_id
                }
            });
        }

        if (dog_data.owner) {
            await User.updateOne(
                {_id: id},
                {$push: {my_lost_dogs: dog_data}},
                {runValidators: true}
            );
        } else {
            await User.updateOne(
                {_id: id},
                {$push: {the_lost_dogs: dog_data}},
                {runValidators: true}
            );
        }
    };

    /**
     * Gets the list of a user's lost dogs.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param isOwner
     * @returns {Promise<{message: string}>} A Promise that will be resolved to the user's list of lost dogs.
     */

    async getPosts(id, isOwner) {
        let tmp;

        if (isOwner === 'true') {
            tmp = await User.findOne({_id: id}, {my_lost_dogs: 1});
            return tmp['my_lost_dogs'];
        } else if (isOwner === 'false') {
            tmp = await User.findOne({_id: id}, {the_lost_dogs: 1});
            return tmp['the_lost_dogs'];
        } else {
            return {'message': 'Illegal query, must be true or false'};
        }
    };

    /**
     * Gets a specific lost dog from a user's lost dog list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} dog_name - Name of the dog to search for.
     * @returns {Promise<Array>} A Promise that will be resolved to the list of lost dogs that match the specified name.
     */

    async getMiddlewareMyPost(id, dog_name) {
        return User.findOne(
            {_id: id},
            {my_lost_dogs: {$elemMatch: {dog_name: dog_name}}}
        );
    };

    async getMiddlewareOtherPost(id, dog_name) {
        return User.findOne(
            {_id: id},
            {the_lost_dogs: {$elemMatch: {dog_name: dog_name}}}
        );
    };

    async getMyPostByName(id, dog_name) {
        const myDog = await User.find(
            {_id: id, "my_lost_dogs.dog_name": dog_name},
        );
        return myDog[0].my_lost_dogs;
    };


    async getOtherPostByName(id, dog_name) {
        const otherDog = await User.find(
            {_id: id, "the_lost_dogs.dog_name": dog_name}
        );
        return otherDog[0].the_lost_dogs;
    };

    async getMyPostById(id, dog_id) {
        const myDog = await User.findOne(
            {_id: id},
            {my_lost_dogs: {$elemMatch: {_id: dog_id}}}
        );
        return myDog['my_lost_dogs'][0];
    };


    async getOtherPostById(id, dog_id) {
        const otherDog = await User.findOne(
            {_id: id},
            {the_lost_dogs: {$elemMatch: {_id: dog_id}}}
        );
        return otherDog['the_lost_dogs'][0];
    };

    /**
     * Removes a lost dog from a user's lost dog list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} dog_id - Name of the dog to remove.
     * @returns {Promise<void>}
     */

    async delMyPost(id, dog_id) {
        const myDog = await User.findOne(
            {_id: id},
            {my_lost_dogs: {$elemMatch: {_id: dog_id}}}
        );

        if (myDog['my_lost_dogs'][0].image !== '') {
            await cloudinary.uploader.destroy(myDog['my_lost_dogs'][0].image.id)
        }

        await User.updateOne(
            {_id: id},
            {$pull: {my_lost_dogs: {_id: dog_id}}}
        );
    };

    async delOtherPost(id, dog_id) {
        const otherDog = await User.findOne(
            {_id: id},
            {the_lost_dogs: {$elemMatch: {_id: dog_id}}}
        );

        if (otherDog['the_lost_dogs'][0].image !== '') {
            await cloudinary.uploader.destroy(otherDog['the_lost_dogs'][0].image.id)
        }

        await User.updateOne(
            {_id: id},
            {$pull: {the_lost_dogs: {_id: dog_id}}}
        );
    }

    /**
     * Updates the information of a lost dog in a user's lost dog list.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} dog_id - Name of the dog to update.
     * @param {Object} dog_data - New dog data.
     * @returns {Promise<void>}
     */

    async updateMyPost(id, dog_id, dog_data) {
        const dog = await this.getMyPostById(id, dog_id)

        if (typeof dog.image === "object" && dog_data.image.substring(11, 21) !== "cloudinary") {
            await cloudinary.uploader.destroy(dog.image.id);
            const url = await cloudinary.uploader.upload(dog_data.image);
            dog_data.image = {
                'url': url.url,
                'id': url.public_id
            };
        
        } 
        else if (dog_data.image.substring(11, 21) === "cloudinary") {
            dog_data.image = dog.image;
            dog_data.tags = dog.tags;
            
        } else {
            const url = await cloudinary.uploader.upload(dog_data.image);
            dog_data.image = {
                'url': url.url,
                'id': url.public_id
            };
        }

        await User.updateOne(
            {_id: id, "my_lost_dogs._id": dog_id},
            {$set: {"my_lost_dogs.$": dog_data}},
            {runValidators: true}
        );
    };

    async updateOtherPost(id, dog_id, dog_data) {
        const dog = await this.getOtherPostById(id, dog_id)

        if (typeof dog.image === "object" && dog_data.image.substring(11, 21) !== "cloudinary") {
            await cloudinary.uploader.destroy(dog.image.id);
           const url = await cloudinary.uploader.upload(dog_data.image);
            dog_data.image = {
                'url': url.url,
                'id': url.public_id
            };
            
        } else if (dog_data.image.substring(11, 21) === "cloudinary") {
            dog_data.image = dog.image;
            dog_data.tags = dog.tags;
            
        } else {
            const url = await cloudinary.uploader.upload(dog_data.image);
            dog_data.image = {
                'url': url.url,
                'id': url.public_id
            };
        }

        await User.updateOne(
            {_id: id, "the_lost_dogs._id": dog_id},
            {$set: {"the_lost_dogs.$": dog_data}},
            {runValidators: true}
        );
    };

    async insertTagsMyPost(id, dog_id, data) {
        await User.updateOne(
            {_id: id, "my_lost_dogs._id": dog_id},
            {$push: {"my_lost_dogs.$.tags": data}}
        );
    };

    async insertTagsOtherPost(id, dog_id, data) {
        await User.updateOne(
            {_id: id, "the_lost_dogs._id": dog_id},
            {$push: {"the_lost_dogs.$.tags": data}}
        );
    };

    async delTagsMyPost(id, dog_id, key, tag_value) {
        await User.updateOne(
            {_id: id, "my_lost_dogs._id": dog_id},
            {$pull: {"my_lost_dogs.$.tags": {[key]: tag_value}}}
        );
    };

    async delTagsOtherPost(id, dog_id, key, tag_value) {
        await User.updateOne(
            {_id: id, "the_lost_dogs._id": dog_id},
            {$pull: {"the_lost_dogs.$.tags": {[key]: tag_value}}}
        );
    };
}

module.exports = DogsServices;
