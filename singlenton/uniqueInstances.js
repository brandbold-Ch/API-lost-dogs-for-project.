const userService = require('../services/userServices');
const petsService = require('../services/petsServices');
const authService = require('../services/authServices');
const guestsServices = require('../services/guestsServices');
const adminServices = require('../services/adminServices');
const collabServices = require('../services/collabServices');
const express = require('express');
const users = new userService();
const pets = new petsService();
const auths = new authService();
const guests = new guestsServices();
const admin = new adminServices();
const collabs = new collabServices();
const app = express();

module.exports = {
    users,
    express,
    guests,
    admin,
    pets,
    auths,
    collabs,
    app
}
