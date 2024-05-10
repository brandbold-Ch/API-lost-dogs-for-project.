const guestControllers = require('../controllers/guestControllers');
const {checkPostExistsForGuest, checkQueryParameters, checkBulletinExistsForGuest} = require('../middlewares/anyMiddlewares');
const express = require('express');
const postControllers = require("../controllers/postControllers");
const postsRouter = express.Router();
const bulletinsRouter = express.Router();


postsRouter.get('/', guestControllers.getLostPets);
postsRouter.get('/search', checkPostExistsForGuest, guestControllers.getUserAndPet);
postsRouter.get("/search/chrt", checkQueryParameters, guestControllers.filterAllPosts);

bulletinsRouter.get('/', guestControllers.getBulletins);
bulletinsRouter.get('/search', checkBulletinExistsForGuest, guestControllers.getBulletin);

module.exports = {
    postsRouter,
    bulletinsRouter
}
