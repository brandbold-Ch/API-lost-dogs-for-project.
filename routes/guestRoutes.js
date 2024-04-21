const guestControllers = require('../controllers/guestControllers');
const {checkPostExists, checkQueryParameters} = require('../middlewares/generalMiddlewares');
const express = require('express');
const guestRouter = express.Router();


guestRouter.get('/publications', guestControllers.getLostPets);
guestRouter.get('/publications/search', checkPostExists, guestControllers.getUserAndPet);
guestRouter.get('/publications/filter/specie', checkQueryParameters, guestControllers.getFilterPostSpecie);
guestRouter.get('/publications/filter/gender', checkQueryParameters, guestControllers.getFilterPostGender);
guestRouter.get('/publications/filter/size', checkQueryParameters, guestControllers.getFilterPostSize);
guestRouter.get('/publications/filter/breed', guestControllers.getFilterPostBreed);
guestRouter.get('/publications/filter/found', checkQueryParameters, guestControllers.getFilterPostFound);
guestRouter.get('/publications/filter/owner', checkQueryParameters, guestControllers.getFilterPostOwner);
guestRouter.get('/publications/filter/date', guestControllers.getFilterPostLostDate);
guestRouter.get('/publications/filter/year', guestControllers.getFilterPostYear);
guestRouter.get('/bulletins', guestControllers.getBulletins);
guestRouter.get('/bulletins/search', guestControllers.getBulletin);

module.exports = {guestRouter};
