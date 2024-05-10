const userControllers = require('../controllers/userControllers');
const {postRouter} = require("./postRoutes");
const {bulletinRouter} = require("./bulletinRoutes");const {Authenticate} = require('../middlewares/authenticator');
const {authRouter} = require("./authRoutes");
const {validateUserData} = require("../middlewares/handlerInputData/handlerUserData");
const express = require('express');
const userRouter = express.Router();
const {
    checkEntityExists,
    checkAccountExists,
    checkRequestExistsForUser,
    seeRequest
} = require('../middlewares/anyMiddlewares');

userRouter.post("/", express.urlencoded({extended: true}), validateUserData, checkAccountExists, userControllers.setUser);

userRouter.use([
    Authenticate,
    checkEntityExists
]);

userRouter.get("/", userControllers.getUser);
userRouter.delete("/", userControllers.deleteUser);
userRouter.put("/", express.urlencoded({extended: true}), validateUserData, userControllers.updateUser);
userRouter.delete('/networks', userControllers.deleteSocialMedia);
userRouter.post("/requests", checkRequestExistsForUser, userControllers.makeRescuer);
userRouter.get("/requests", seeRequest, userControllers.getRequests);

userRouter.use([
    authRouter,
    postRouter,
    bulletinRouter
]);

module.exports = {userRouter};
