const userService = require('../services/userServices');
const petsService = require('../services/petsServices');
const authService = require('../services/authServices');
const guestsServices = require('../services/guestsServices');
const express = require('express');
const users = new userService();
const pets = new petsService();
const auths = new authService();
const guests = new guestsServices();
const app = express();

module.exports = {
    users,
    express,
    guests,
    pets,
    auths,
    app
}
