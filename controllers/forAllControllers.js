/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating application services.
 */

const forAllServices = require('../services/forAllServices');
const service = new forAllServices();

/**
 * Get all the lost pets
 * @async
 * @function
 * @returns {Promise<Array>}
 * */

exports.getAllLostPets = async (isOwner) => {
    return await service.getAllLostPets(isOwner);
};

exports.getAllPets = async () => {
    return await service.getAllPets();
}

/**
 * Get user and pet information.
 * @async
 * @function
 * @param {string} id - ID user
 * @param {string} dog_id - Pet ID identifier
 * @param {boolean} isOwner - Flag to determine if the user is the owner
 * @returns {Promise<Array>} - A promise that resolves to an array.
 */

exports.getUserAndPet = async (id, pet_id, isOwner) => {
    return await service.getUserAndPet(id, pet_id, isOwner);
};

/**
 * Get information about pets of a specific species based on ownership.
 * @async
 * @function
 * @param {boolean} isOwner - Indicates if the user is the owner.
 * @param {string} pet_specie - The species of the pet.
 * @returns {Promise<Array>} A Promise that resolves to an array containing information about pets of the specified species.
 */

exports.getSpecies = async (isOwner, pet_specie) => {
    return await service.getSpecies(isOwner, pet_specie)
}