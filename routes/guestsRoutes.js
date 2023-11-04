const guestsControllers = require('../controllers/guestsControllers');
const { checkUserExists } = require('../middlewares/entityManager');
const { checkPostExists } = require('../middlewares/entityManager');
const express = require('express');
const guestsRoute = express.Router();

guestsRoute.get('/publications', guestsControllers.getLostPets);
guestsRoute.get('/publications/search', checkUserExists, checkPostExists , guestsControllers.getUserAndPet);
guestsRoute.get('/publications/filter/specie', guestsControllers.getFilterPostSpecie);
guestsRoute.get('/publications/filter/gender', guestsControllers.getFilterPostGender);
guestsRoute.get('/publications/filter/size', guestsControllers.getFilterPostSize);
guestsRoute.get('/publications/filter/breed', guestsControllers.getFilterPostBreed);
guestsRoute.get('/publications/filter/found', guestsControllers.getFilterPostFound);
guestsRoute.get('/publications/filter/owner', guestsControllers.getFilterPostOwner);
guestsRoute.get('/publications/filter/id', guestsControllers.getFilterPostById);

module.exports = guestsRoute;
