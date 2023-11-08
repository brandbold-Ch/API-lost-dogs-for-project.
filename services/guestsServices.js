/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to unauthenticated users
 */

const { User } = require('../models/user');

/**
 * Class that provides services related to the application.
 * @class
 */

class GuestsServices {

    constructor() {};

    async getUserAndPet(id, pet_id){

        const user = await User.findOne(
            {
                _id: id
            },
            {
                lost_pets: 0,
                _id:0,
                __v: 0
            }
        );

        const pet = await User.findOne(
            {
                _id: id
            },
            {
                _id: 0,
                lost_pets: {
                    $elemMatch: {
                        _id: pet_id
                    }
                }
            }
        );

        if (pet){
            return [user, pet['lost_pets'][0]];
        } else {
            return [];
        }
    };

    /**
     * Get information about all lost dogs based on ownership.
     * @async
     * @function
     * @returns {Promise<Array||Object>} A Promise that resolves to an array containing information about lost dogs.
     */

    async getAllLostPets(){
        return User.aggregate([
            {
                $unwind: '$lost_pets'
            },
            {
                $addFields: {
                    'lost_pets.user': "$_id"
                }
            },
            {
                $replaceRoot: {
                    newRoot: '$lost_pets'
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    name: 1,
                    details: 1,
                    publication: 1,
                    status: 1,
                    'identify.image': 1,
                    feedback: 1
                }
            },
        ]);
    };

    async getFilterPostGender(gender) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.details.gender === gender);
    };

    async getFilterPostBreed(breed) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.details.breed === breed);
    };

    async getFilterPostSize(size) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.details.size === size);
    };

    async getFilterPostOwner(owner) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.status.owner === JSON.parse(owner));
    };

    async getFilterPostFound(found) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.status.found === JSON.parse(found));
    };

    async getFilterPostById(id) {
        const array = await this.getAllLostPets();
        return array.filter(key => key._id.toString() === id);
    };

    async getFilterPostSpecie(specie) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.details.specie === specie);
    };
}

module.exports = GuestsServices;
