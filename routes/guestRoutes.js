const guestsControllers = require('../controllers/guestControllers');
const { checkUserExists } = require('../middlewares/entityManager');
const { checkPostExists } = require('../middlewares/entityManager');
const { checkQueryParameters } = require('../middlewares/entityManager');
const express = require('express');
const guestsRoute = express.Router();

guestsRoute.get('/publications', guestsControllers.getLostPets);
guestsRoute.get('/publications/search', checkPostExists , guestsControllers.getUserAndPet);
guestsRoute.get('/publications/filter/specie', checkQueryParameters, guestsControllers.getFilterPostSpecie);
guestsRoute.get('/publications/filter/gender', checkQueryParameters, guestsControllers.getFilterPostGender);
guestsRoute.get('/publications/filter/size', checkQueryParameters, guestsControllers.getFilterPostSize);
guestsRoute.get('/publications/filter/breed', guestsControllers.getFilterPostBreed);
guestsRoute.get('/publications/filter/found', checkQueryParameters, guestsControllers.getFilterPostFound);
guestsRoute.get('/publications/filter/owner', checkQueryParameters, guestsControllers.getFilterPostOwner);
guestsRoute.get('/publications/filter/date', guestsControllers.getFilterPostLostDate);
guestsRoute.get('/publications/filter/year', guestsControllers.getFilterPostYear);

module.exports = guestsRoute;
