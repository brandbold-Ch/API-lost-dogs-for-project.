/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is the configuration of database
 */

const cloudinary = require('cloudinary').v2;

const credentials = {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'Contactos',
    port: 27017
};

cloudinary.config({
    cloud_name: 'dq8syevxm',
    api_key: '631793189673192',
    api_secret: 'I6lEB9jlisDabtU2TnMgx9kPkwI'
});


module.exports = {
    credentials,
    cloudinary
};