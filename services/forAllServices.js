/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module interacts with the database and provides
 * functionality to unauthenticated users
 */

const User = require('../models/user');

/**
 * Class that provides services related to the application.
 * @class
 */

class ForAllServices {

    constructor() {};

    /**
     * Get information about a user and a specific dog based on ownership.
     * @async
     * @function
     * @param {string} id - User identifier.
     * @param {string} pet_id - ID of the pet.
     * @param {boolean} isOwner - Indicates if the user is the owner.
     * @returns {Promise<Array||Object>} A Promise that resolves to an array containing information about the user and the specific pet.
     */

    async getUserAndPet(id, pet_id, isOwner){
        let user; let pet; let array

        if (isOwner === 'true') {
            array = "my_lost_pets";

        }
        else if (isOwner === 'false') {
            array = "the_lost_pets"

        }else {
            return {'message': 'You must specify the user, pet and if it is the owner in false or true'};
        }

        user = await User.findOne({_id: id}, {the_lost_pets: 0, _id:0, my_lost_pets: 0, __v: 0});
        pet = await User.findOne(
            {_id: id},
            {[`${array}`]: {$elemMatch: {_id: pet_id}}}
        );

        if (pet[array][0]){
            return [user, pet[array][0]];
        } else {
            return []
        }
    };

    /**
     * Get information about all lost dogs based on ownership.
     * @async
     * @function
     * @param {boolean} isOwner - Indicates if the user is the owner.
     * @returns {Promise<Array||Object>} A Promise that resolves to an array containing information about lost dogs.
     */

    async getAllLostPets(isOwner){
        let array;

        if (isOwner === 'true'){
            array = "my_lost_pets";

        }
        else if (isOwner === 'false') {
            array = "the_lost_pets";

        } else {
            return {'message': 'Illegal query, must be true or false'};
        }

        return User.aggregate([
            {
                $unwind: `$${array}`
            },
            {
                $addFields: {
                    [`${array}.owner`]: "$_id"
                }
            },
            {
                $replaceRoot: { newRoot: `$${array}`}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    gender: 1,
                    age: 1,
                    last_seen: 1,
                    description: 1,
                    image: 1,
                    size: 1,
                    breed: 1,
                    update: 1,
                    date: 1,
                    lost_date: 1,
                    found: 1,
                    owner: 1,
                    tags: 1
                }
            }
        ]);
    };

    async getAllPets() {
        const array1 = await User.aggregate([
            {
                $unwind: "$my_lost_pets",
            },
            {
                $addFields: {
                    "my_lost_pets.owner": "$_id"
                }
            },
            {
                $replaceRoot: { newRoot: "$my_lost_pets"}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    gender: 1,
                    age: 1,
                    last_seen: 1,
                    description: 1,
                    image: 1,
                    size: 1,
                    breed: 1,
                    update: 1,
                    date: 1,
                    lost_date: 1,
                    found: 1,
                    owner: 1,
                    tags: 1
                }
            }
        ]);

        const array2 = await User.aggregate([
            {
                $unwind: "$the_lost_pets",
            },
            {
                $addFields: {
                    "the_lost_pets.owner": "$_id"
                }
            },
            {
                $replaceRoot: { newRoot: "$the_lost_pets"}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    gender: 1,
                    age: 1,
                    last_seen: 1,
                    description: 1,
                    image: 1,
                    size: 1,
                    breed: 1,
                    update: 1,
                    date: 1,
                    lost_date: 1,
                    found: 1,
                    owner: 1,
                    tags: 1
                }
            }
        ]);
        return array1.concat(array2);
    }

    /**
     * Get information about pets of a specific species based on ownership.
     * @async
     * @function
     * @param {boolean} isOwner - Indicates if the user is the owner.
     * @param {string} pet_specie - The species of the pet.
     * @returns {Promise<Array||Object>} A Promise that resolves to an array containing information about pets of the specified species.
     */

    async getSpecies(isOwner, pet_specie){
        let array;

        if (isOwner === 'true') {
            array = "my_lost_pets";

        }
        else if (isOwner === 'false') {
            array = "the_lost_pets";

        } else {
            return {'message': 'You must set the owner parameter to false or true and type the specie'};
        }

        return User.aggregate([
            {
                $project: {
                    [`${array}`]: {
                        $filter: {
                            input: `$${array}`,
                            as: "pet",
                            cond: {$eq: ["$$pet.specie", pet_specie]}
                        }
                    },
                    _id: 1
                }
            },
            {
                $unwind: `$${array}`
            },
            {
                $addFields: {
                    [`${array}.user`]: "$_id"
                }
            },
            {
                $replaceRoot: {
                    newRoot: `$${array}`
                }
            }
        ]);
    }
}

module.exports = ForAllServices;
