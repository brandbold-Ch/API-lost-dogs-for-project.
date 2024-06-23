const userControllers = require('../controllers/userControllers');
const { postRouter } = require("./postRoutes");
const { bulletinRouter } = require("./bulletinRoutes");
const { Authenticate } = require('../middlewares/authenticator');
const { authRouter } = require("./authRoutes");
const { blogRouter } = require("./blogRoutes");
const { validateUserData } = require("../middlewares/handler/handlerUserData");
const express = require('express');
const userRouter = express.Router();
const {
    checkEntityExists,
    checkAccountExists,
    checkRequestExistsForUser,
    showRequest
} = require('../middlewares/anyMiddlewares');

userRouter.post("/", validateUserData, checkAccountExists, userControllers.createUser);

userRouter.use([
    Authenticate,
    checkEntityExists
]);

userRouter.get("/", userControllers.getUser);
userRouter.delete("/", userControllers.deleteUser);
userRouter.put("/", validateUserData, userControllers.updateUser);
userRouter.delete('/networks', userControllers.deleteSocialMedia);
userRouter.post("/requests/rescuer", checkRequestExistsForUser, userControllers.makeRescuer);
userRouter.post("/requests/association", checkRequestExistsForUser, userControllers.makeAssociation);
userRouter.get("/requests", showRequest, userControllers.getRequests);

userRouter.use([
    authRouter,
    postRouter,
    bulletinRouter,
    blogRouter
]);

module.exports = { userRouter };
