const { checkUserExists } = require('../middlewares/entityManager');
const authControllers = require('../controllers/authControllers');
const isAuthenticate = require('../middlewares/authenticate');
const express = require('express');
const authRoute = express.Router();

authRoute.get('/credentials', isAuthenticate, checkUserExists, authControllers.getCredentials);
authRoute.post('/login', express.urlencoded({ extended: true }), authControllers.login);
authRoute.put('/credentials', isAuthenticate, checkUserExists, express.urlencoded({ extended: true }), authControllers.updateCredentials);
authRoute.post('/status/token', authControllers.statusToken);

module.exports = authRoute;
