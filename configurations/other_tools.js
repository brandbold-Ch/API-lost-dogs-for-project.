/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is the configuration of database
 */

const cloudinary = require('cloudinary').v2;
require("dotenv").config();

/**
 * Configuration for Cloudinary.
 * @typedef {Object} CloudinaryConfig
 * @property {string} cloud_name - Cloudinary cloud name associated with the account.
 * @property {string} api_key - API key provided by Cloudinary to authenticate API requests.
 * @property {string} api_secret - API secret provided by Cloudinary to authenticate API requests.
 */


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_CLOUD_KEY,
    api_secret: process.env.API_SECRET_CLOUD
});


module.exports = {
    cloudinary
};
