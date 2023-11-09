const { checkTrust } = require('../middlewares/entityManager');
const { checkUserExists } = require('../middlewares/entityManager');
const isAuthenticate = require('../middlewares/authenticate');
const adminControllers = require('../controllers/adminControllers');
const express = require('express');
const adminRoute = express.Router();

adminRoute.post('/new', express.urlencoded({ extended: true }), checkTrust, adminControllers.setAdmin);
adminRoute.get('/', isAuthenticate, checkUserExists, adminControllers.getAdmin);
adminRoute.put('/', isAuthenticate, checkUserExists, express.urlencoded({ extended: true }), adminControllers.updateAdmin);

module.exports = adminRoute;
