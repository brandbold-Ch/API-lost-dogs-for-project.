const { checkUserExists } = require('../middlewares/entityManager');
const userControllers = require('../controllers/userControllers');
const isAuthenticate = require('../middlewares/authenticate');
const express = require('express');
const usersRoute = express.Router();

usersRoute.get('/', isAuthenticate, checkUserExists, userControllers.getUser);
usersRoute.delete('/', isAuthenticate, checkUserExists, userControllers.delUser);
usersRoute.put('/', isAuthenticate, checkUserExists, express.urlencoded({ extended: true }), userControllers.updateUser);
usersRoute.post('/', express.urlencoded({ extended: true }), userControllers.setUser);
usersRoute.put('/networks', isAuthenticate, checkUserExists, express.urlencoded({ extended: true }), userControllers.updateSocialMedia);
usersRoute.get('/test', userControllers.getUsers);

module.exports = usersRoute;
