const { checkUserExists } = require('../middlewares/entityManager');
const authControllers = require('../controllers/authControllers')
const isAuthenticate = require('../middlewares/authenticate');
const express = require('express');
const authRoute = express.Router();

authRoute.get('/:id/credentials', checkUserExists, isAuthenticate, authControllers.getCredentials);
authRoute.post('/login', express.urlencoded({ extended: true }), authControllers.login);
authRoute.put('/:id/credentials', checkUserExists, isAuthenticate, express.urlencoded({ extended: true }), authControllers.updateCredentials);

module.exports = authRoute;
