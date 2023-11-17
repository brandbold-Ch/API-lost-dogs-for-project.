/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to unauthenticated users
 */

const Pet = require('../models/pets');

/**
 * Class that provides services related to the application.
 * @class
 */

class GuestsServices {

    constructor() {};

    async getUserAndPet(pet_id){
        return Pet.findById(pet_id,
            {_id: 0, __v: 0}
        ).populate('user', { __v: 0 });
    };

    /**
     * Get information about all lost dogs based on ownership.
     * @async
     * @function
     * @returns {Promise<Array||Object>} A Promise that resolves to an array containing information about lost dogs.
     */

    async getAllLostPets(){
        return Pet.find({}, { "identify.gallery": 0, user: 0, __v: 0 });
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
