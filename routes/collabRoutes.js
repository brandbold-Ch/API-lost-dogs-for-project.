const collabControllers = require('../controllers/collabControllers');
const { checkUserExists, isActive } = require('../middlewares/entityManager');
const isAuthenticate = require('../middlewares/authenticate');
const express = require('express');
const collabRouter = express.Router();

collabRouter.post('/', express.urlencoded({ extended: true }), collabControllers.setCollab);
collabRouter.get('/', isAuthenticate, checkUserExists, isActive, collabControllers.getCollab);

module.exports = collabRouter;
