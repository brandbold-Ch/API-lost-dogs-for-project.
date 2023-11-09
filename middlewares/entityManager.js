/**
 * @author Brandon Jared Molina Vazquez
 * @date 30/09/2023
 * @file This module is for user middleware.
 */

const { pets, auths } = require('../singlenton/uniqueInstances');

/**
 * Middleware to check if a user with the specified ID exists.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const checkUserExists = async (req, res, next) => {
    try {
        const entity = await auths.getUser(req.query.user || req.id);

        if (entity) {
            next();
        } else {
            res.status(404).json({message: 'Not found user 🚫'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const checkPostExists = async (req, res, next) => {
    try {
        const pet = await pets.getPost(req.query.user || req.id, req.params.pet_id || req.query.pet);

        if (pet) {
            next();
        } else {
            res.status(404).json({message: 'Not found post 🚫'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const checkQueryParameters = async (req, res, next) => {
    try {
        const link = req.query.value;
        const value = req.path.split('/').pop();

        const choices = {
            size: ['Chico', 'Mediano', 'Grande'],
            gender: ['Hembra', 'Macho'],
            owner: ['true', 'false'],
            found: ['true', 'false'],
            id: [],
            breed: [],
            specie: ['Perro', 'Gato', 'Ave']
        }

        if (link && choices[value].includes(link) || choices[value].length === 0) {
            next();
        } else {
            res.status(400).json({message: `The parameters must be 👉 ${choices[value]} 👈`});
        }

    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

const checkTrust = async (req, res, next) => {
    try {

        if (req.body.token === process.env.TRUSTED_PERMISSIONS) {
            next();
        } else {
            res.status(403).json({message: 'Can\'t create an administrator account 💩'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    checkUserExists,
    checkPostExists,
    checkQueryParameters,
    checkTrust
};
