const { checkTrust } = require('../middlewares/entityManager');
const adminControllers = require('../controllers/adminControllers');
const express = require('express');
const adminRoute = express.Router();

adminRoute.post('/new', express.urlencoded({ extended: true }), checkTrust, adminControllers.setAdmin);

module.exports = adminRoute;
