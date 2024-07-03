const guestControllers = require("../controllers/guestControllers");
const {
    checkPostExistsForGuest,
    checkQueryParameters,
    checkBulletinExistsForGuest,
    checkBlogExistsForGuest
} = require("../middlewares/middlewaresFunctions");
const express = require('express');
const postsRouter = express.Router();
const bulletinsRouter = express.Router();
const blogsRouter = express.Router();


postsRouter.get("/", guestControllers.getLostPets);
postsRouter.get("/search", checkPostExistsForGuest, guestControllers.getUserAndPet);
postsRouter.get("/search/chrt", checkQueryParameters, guestControllers.filterAllPosts);

bulletinsRouter.get("/", guestControllers.getBulletins);
bulletinsRouter.get("/search", checkBulletinExistsForGuest, guestControllers.getBulletin);

blogsRouter.get("/", guestControllers.getBlogs);
blogsRouter.get("/search", checkBlogExistsForGuest, guestControllers.getBlog);

module.exports = {
    postsRouter,
    bulletinsRouter,
    blogsRouter
}
