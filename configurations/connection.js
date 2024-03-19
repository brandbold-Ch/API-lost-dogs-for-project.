/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is the configuration to mongodb
 */

const mongoose = require("mongoose");
require("dotenv").config();


/**
 * Here the connection with mongodb is established
 * @returns {Promise<void>}
 * */

mongoose.connect(process.env.URL_DATABASE, {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const conn = mongoose.connection;

conn.on("error", () => console.log("Connection error"));
conn.on("connected", () => console.log("Connection to Database is successful"));
conn.on("reconnected", () => console.log("Reconnected"));

module.exports = conn;
