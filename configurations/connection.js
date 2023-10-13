/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is the configuration to mongodb
 */

const mongoose = require('mongoose');
const { credentials: db } = require('./config');
require('dotenv').config();


/**
 * Here the connection with mongodb is established
 * @returns {Promise<void>}
 * */

const connection = mongoose.connect(process.env.URL_DATABASE)
    .then(() => {
        console.log("Successful connection")
    }).catch(() => {
        console.log("Connection error")
    });

module.exports = connection;
