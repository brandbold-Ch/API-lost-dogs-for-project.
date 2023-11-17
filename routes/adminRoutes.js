const { checkTrust } = require('../middlewares/entityManager');
const { checkUserExists, checkRequestExists } = require('../middlewares/entityManager');
const { checkQueryStatus } = require('../middlewares/entityManager');
const isAuthenticate = require('../middlewares/authenticate');
const adminControllers = require('../controllers/adminControllers');
const express = require('express');
const adminRoute = express.Router();

adminRoute.post('/new', express.urlencoded({ extended: true }), checkTrust, adminControllers.setAdmin);
adminRoute.get('/', isAuthenticate, checkUserExists, adminControllers.getAdmin);
adminRoute.put('/', isAuthenticate, checkUserExists, express.urlencoded({ extended: true }), adminControllers.updateAdmin);
adminRoute.delete('/', isAuthenticate, checkUserExists, adminControllers.delAdmin);
adminRoute.get('/requests', adminControllers.getRequests);
adminRoute.post('/requests/activate/:id', isAuthenticate, checkUserExists, checkRequestExists, adminControllers.activateRequest);
adminRoute.post('/requests/deactivate/:id', isAuthenticate, checkUserExists, checkRequestExists, adminControllers.deactivateRequest);
adminRoute.post('/requests/reject/:id', isAuthenticate, checkUserExists, checkRequestExists, adminControllers.rejectRequest);
adminRoute.get('/requests/filter', isAuthenticate, checkUserExists, checkQueryStatus, adminControllers.filterRequests)

module.exports = adminRoute;
