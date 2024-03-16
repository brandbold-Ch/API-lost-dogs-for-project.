/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is the configuration to mongodb
 */

const mongoose = require("mongoose");
const { credentials: db } = require("./config_extra");
require("dotenv").config();


/**
 * Here the connection with mongodb is established
 * @returns {Promise<void>}
 * */
//`mongodb://${db.host}:${db.port}/${db.database}`

mongoose.connect(process.env.URL_DATABASE)
    .then(() => {
        console.log("Successful connection");
    }).catch((err) => {
    console.log(err.message);
});

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));
conn.once("open", () => console.info("Connection to Database is successful"));

module.exports = conn;
