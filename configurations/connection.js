/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is the configuration to mongodb
 */

const mongoose = require('mongoose');
const { credentials: db } = require('./config');

/**
 * Here the connection with mongodb is established
 * @returns {Promise<void>}
 * */

const connection = mongoose.connect("mongodb+srv://223031:EWwe05ZQcQgV9AuR@cluster0.glnagiz.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Successful connection")
    }).catch(() => {
        console.log("Connection error")
    });

module.exports = connection;
