/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to unauthenticated users
 */

const Post = require('../models/post');
const Bulletin = require('../models/bulletin');

/**
 * Class that provides services related to the application.
 * @class
 */

class GuestServices {

    constructor() {};

    async getUserAndPet(pet_id){
        return Post.findById(pet_id, { _id: 0 }).populate('user');
    };

    /**
     * Get information about all lost dogs based on ownership.
     * @async
     * @function
     * @returns {Promise<Array||Object>} A Promise that resolves to an array containing information about lost dogs.
     */

    async getAllLostPets(){
        return Post.find({}).sort({ "publication.lost_date": -1 });
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

    async getFilterPostLostDate(lost_date) {
        const array = await this.getAllLostPets();

        return array.filter(key => {
            const date = key.publication.lost_date
            return date.toISOString() === lost_date.substring(0, 23)+"Z";
        });
    }

    async getFilterPostYear(year) {
        const array = await this.getAllLostPets();

        return array.filter(key => {
            const date = key.publication.lost_date
            return date.getFullYear() === parseInt(year);
        });
    }

    async getBulletins() {
        return Bulletin.find({}, { user:0 }).sort({ "identify.timestamp": -1 });
    }

    async getBulletin(id) {
        return Bulletin.findById(id).populate("user");
    }
}

module.exports = GuestServices;
