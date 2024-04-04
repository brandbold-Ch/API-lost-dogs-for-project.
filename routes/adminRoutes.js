const { checkTrust } = require('../middlewares/entityManager');
const { checkUserExists, checkRequestExists } = require('../middlewares/entityManager');
const { checkQueryStatus, checkQueryAction } = require('../middlewares/entityManager');
const isAuthenticate = require('../middlewares/authenticate');
const adminControllers = require('../controllers/adminControllers');
const express = require('express');
const adminRoute = express.Router();


adminRoute.post('/', express.urlencoded({ extended: true }), checkTrust, adminControllers.setAdmin);
adminRoute.get('/', isAuthenticate, checkUserExists, adminControllers.getAdmin);
adminRoute.put('/', isAuthenticate, checkUserExists, express.urlencoded({ extended: true }), adminControllers.updateAdmin);
adminRoute.delete('/', isAuthenticate, checkUserExists, adminControllers.delAdmin);
adminRoute.get('/requests', isAuthenticate, checkUserExists, adminControllers.getRequests);
adminRoute.delete('/requests/:id', isAuthenticate, checkUserExists, adminControllers.deleteRequest);
adminRoute.post('/requests/:id', isAuthenticate, checkUserExists, checkRequestExists, checkQueryAction, adminControllers.actionRequest);
adminRoute.get('/requests/filter', isAuthenticate, checkUserExists, checkQueryStatus ,adminControllers.filterRequests)
adminRoute.get('/collabs', isAuthenticate, checkUserExists, adminControllers.getCollabs);
adminRoute.get('/collabs/:collab_id', isAuthenticate, checkUserExists, adminControllers.getCollab);
adminRoute.delete('/collabs/:collab_id', isAuthenticate, checkUserExists, adminControllers.deleteCollab);
adminRoute.get('/users', isAuthenticate, checkUserExists, adminControllers.getUsers);
adminRoute.get('/users/:user_id', isAuthenticate, checkUserExists, adminControllers.getUser);
adminRoute.delete('/users/:user_id', isAuthenticate, checkUserExists, adminControllers.deleteUser);

module.exports = adminRoute;
