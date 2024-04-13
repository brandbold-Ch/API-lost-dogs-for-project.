/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is the configuration to mongodb
 */
const cloudinary = require('cloudinary').v2;
const mongoose = require("mongoose");
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


/**
 * Here the connection with mongodb is established
 * @returns {Promise<void>}
 * */

mongoose.connect(process.env.URL_DATABASE, {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.on("error", () => console.log("Connection error"));
connection.on("connected", () => console.log("Connection to Database is successful"));
connection.on("reconnected", () => console.log("Reconnected"));

module.exports = {
    connection,
    cloudinary
};
