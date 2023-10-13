/**
 * @author Brandon Jared Molina Vazquez
 * @date 30/09/2023
 * @file This module is for user authentication.
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to check the authentication using JSON Web Tokens (JWT).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const isAuthenticate = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization;

        if (token) {
            // Verify the token and attach user information to the request object
            req.user = jwt.verify(token.substring(7), process.env.SECRET_KEY);
            next();
        } else {
            // If no token is provided, return a 401 Unauthorized response
            res.status(401).json({'message': 'Not received token'});
        }

    } catch (error) {
        // If there's an error during token verification, return a 401 Unauthorized response
        res.status(401).json({'message': error.message});
    }
};

module.exports = isAuthenticate;