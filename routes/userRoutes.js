const { checkUserExists } = require('../middlewares/entityManager');
const userControllers = require('../controllers/userControllers');
const isAuthenticate = require('../middlewares/authenticate');
const express = require('express');
const usersRoute = express.Router();

usersRoute.get('/test', userControllers.getUsers);
usersRoute.get('/:id', checkUserExists, isAuthenticate, userControllers.getUser);
usersRoute.post('/new', express.urlencoded({ extended: true }), userControllers.setUser);
usersRoute.put('/:id', checkUserExists, isAuthenticate, express.urlencoded({ extended: true }), userControllers.updateUser);
usersRoute.put('/:id/networks', checkUserExists, isAuthenticate, express.urlencoded({ extended: true }), userControllers.updateSocialMedia);
usersRoute.delete('/:id', checkUserExists, isAuthenticate, userControllers.delUser);

module.exports = usersRoute;
