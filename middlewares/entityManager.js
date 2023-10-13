/**
 * @author Brandon Jared Molina Vazquez
 * @date 30/09/2023
 * @file This module is for user middleware.
 */

const userControllers = require('../controllers/userControllers');
const petsControllers = require('../controllers/petsControllers');

/**
 * Middleware to check if a user with the specified ID exists.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const checkUserExists = async (req, res, next) => {
    try {
        const user = await userControllers.getUser(req.params.id || req.query.user);
        if (user) {
            next();
        } else {
            res.status(404).json({'message': 'Not found user'});
        }
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
};

/**
 * Middleware to check if a post with the specified ID or pet name exists in the user's array.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const checkMyPostExists = async (req, res, next) => {
    try {
        if (req.query.pet) {
            const post = await petsControllers.getMiddlewareMyPost(req.params.id, req.query.pet);
            if (post['my_lost_pets'].length){
                next();
            } else {
                res.status(404).json({'message': 'Not found post'});
            }

        } else if (req.query.id) {
            const post = await petsControllers.getMyPostById(req.params.id, req.query.id);
            if (post){
                next();
            } else {
                res.status(404).json({'message': 'Not found post'});
            }
        } else {
            res.status(404).json({'message': 'You need to define the query to get the pet'});
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
};

/**
 * Middleware to check if a post with the specified ID or pet name exists in other users' arrays.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const checkOtherPostExists = async (req, res, next) => {
    try {
        if (req.query.pet) {
            const post = await petsControllers.getMiddlewareOtherPost(req.params.id, req.query.pet);

            if (post['the_lost_pets'].length){
                next();
            } else {
                res.status(404).json({'message': 'Not found post'});
            }

        } else if (req.query.id) {
            const post = await petsControllers.getOtherPostById(req.params.id, req.query.id);

            if (post){
                next();
            } else {
                res.status(404).json({'message': 'Not found post'});
            }

        } else {
            res.status(404).json({'message': 'You need to define the query to get the pet'});
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
};

/**
 * General endpoint middleware for custom endpoint validation.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const generalEndpoint = async (req, res, next) => {
    try {

        if (req.url.substring(0, 20) === '/api/pets/lost/board') {
            if (req.query.pet && req.query.user) {
                next();
            } else {
                res.status(404).json(
                    {'message': 'You must configure the user and pet id (user=id & pet=id)'}
                );
            }
        }

        else if (req.url.substring(0, 14) === '/api/pets/lost') {
            if (req.query.owner) {
                next();
            }else {
                res.status(404).json({'message': 'You must set the owner parameter to false or true'})
            }
        }

        else if (req.url.substring(0, 21) === '/api/pets/lost/specie') {
            if (req.query.type && req.query.owner){
                next();
            }
            else {
                res.status(404).json({'message': 'You must set the owner parameter to false or true and type the specie'})
            }
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
}

module.exports = {
    checkUserExists,
    checkMyPostExists,
    checkOtherPostExists,
    generalEndpoint
};
