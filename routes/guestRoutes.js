const guestControllers = require('../controllers/guestControllers');
const {checkPostExists, checkQueryParameters} = require('../middlewares/generalMiddlewares');
const express = require('express');
const postsRouter = express.Router();
const bulletinsRouter = express.Router();


postsRouter.get('', guestControllers.getLostPets);
postsRouter.get('/search', checkPostExists, guestControllers.getUserAndPet);
postsRouter.get('/filter/specie', checkQueryParameters, guestControllers.getFilterPostSpecie);
postsRouter.get('/filter/gender', checkQueryParameters, guestControllers.getFilterPostGender);
postsRouter.get('/filter/size', checkQueryParameters, guestControllers.getFilterPostSize);
postsRouter.get('/filter/breed', guestControllers.getFilterPostBreed);
postsRouter.get('/filter/found', checkQueryParameters, guestControllers.getFilterPostFound);
postsRouter.get('/filter/owner', checkQueryParameters, guestControllers.getFilterPostOwner);
postsRouter.get('/filter/date', guestControllers.getFilterPostLostDate);
postsRouter.get('/filter/year', guestControllers.getFilterPostYear);

bulletinsRouter.get('/', guestControllers.getBulletins);
bulletinsRouter.get('/search', guestControllers.getBulletin);

module.exports = {
    postsRouter,
    bulletinsRouter
}
