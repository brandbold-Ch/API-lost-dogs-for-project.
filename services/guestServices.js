/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to unauthenticated users
 */

const { Post } = require('../models/post');
const { Blog } = require('../models/blog');
const { Bulletin } = require('../models/bulletin');
const { Rescuer } = require('../models/rescuer');
const { Association } = require("../models/association");

/**
 * Class that provides services related to the application.
 * @class
 */

class GuestServices {

    constructor() {}

    async getUserAndPet(pet_id) {
        return Post.findById(pet_id, {_id: 0})
            .populate({
                path: "user_id",
                select: { posts_id: 0, bulletins_id: 0, _id: 0 },
                populate: {
                    path: "auth_id",
                    select: { email: 1, _id: 0 }
                }
            });
    }

    /**
     * Get information about all lost dogs based on ownership.
     * @async
     * @function
     * @returns {Promise<Array||Object>} A Promise that resolves to an array containing information about lost dogs.
     */

    async getAllLostPets() {
        return Post.find({})
            .populate({
                path: "user_id",
                select: { posts_id: 0, bulletins_id: 0, _id: 0 },
                populate: {
                    path: "auth_id",
                    select: { email: 1, _id: 0 }
                }
            })
            .sort({ "publication.lost_date": -1 });
    }

    async getFilterPostGender(gender) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.details.gender === gender);
    }

    async getFilterPostBreed(breed) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.details.breed === breed);
    }

    async getFilterPostSize(size) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.details.size === size);
    }

    async getFilterPostOwner(owner) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.status.owner === JSON.parse(owner));
    }

    async getFilterPostFound(found) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.status.found === JSON.parse(found));
    }

    async getFilterPostSpecie(specie) {
        const array = await this.getAllLostPets();
        return array.filter(key => key.details.specie === specie);
    }

    async getFilterPostLostDate(lost_date) {
        const array = await this.getAllLostPets();

        return array.filter(key => {
            const date = key.publication.lost_date;
            return date.toISOString() === lost_date.substring(0, 23) + "Z";
        });
    }

    async getFilterPostYear(year) {
        const array = await this.getAllLostPets();

        return array.filter(key => {
            const date = key.publication.lost_date;
            return date.getFullYear() === parseInt(year);
        });
    }

    async getBulletins() {
        return Rescuer.find({}, { user_id: 0, posts_id: 0, blogs_id: 0 })
            .populate({
                path: "bulletins_id",
                select: { user_id: 0 },
                options: {
                    sort: { "identify.timestamp": -1 }
                }
            })
            .populate("auth_id", { email: 1, _id: 0 });
    }

    async getBulletin(id) {
        return Bulletin.findById(id)
            .populate({
                path: "user_id",
                select: { posts_id: 0, _id: 0, bulletins_id: 0, blogs_id: 0 },
                populate: {
                    path: "auth_id",
                    select: { email: 1, _id: 0 }
                }
            });
    }

    async getBlogs() {
        return Rescuer.find({}, { user_id: 0, posts_id: 0, bulletins_id: 0 })
            .populate({
                path: "blogs_id",
                select: { user_id: 0 },
                options: {
                    sort: { "markers.timestamp": -1 }
                }
            })
            .populate("auth_id", { email: 1, _id: 0 });
    }

    async getBlog(id) {
        return Blog.findById(id)
            .populate({
                path: "user_id",
                select: { posts_id: 0, _id: 0, bulletins_id: 0, blogs_id: 0 },
                populate: {
                    path: "auth_id",
                    select: { email: 1, _id: 0 }
                }
            });
    }
}

module.exports = {GuestServices};
