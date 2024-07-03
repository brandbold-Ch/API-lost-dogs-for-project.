const userControllers = require("../controllers/userControllers");
const { postRouter } = require("./postRoutes");
const { Authenticate } = require("../middlewares/authenticator");
const { authRouter } = require("./authRoutes");
const { userDataValidator } = require("../middlewares/joiMiddlewares/userValidator");
const express = require("express");
const userRouter = express.Router();
const {
    checkEntityExists,
    checkAccountExists,
    checkRequestExistsForUser,
    showRequest
} = require("../middlewares/middlewaresFunctions");

userRouter.post("/", userDataValidator, checkAccountExists, userControllers.createUser);

userRouter.use([
    Authenticate,
    checkEntityExists
]);

userRouter.get("/", userControllers.getUser);
userRouter.delete("/", userControllers.deleteUser);
userRouter.put("/", userDataValidator, userControllers.updateUser);
userRouter.delete('/networks', userControllers.deleteSocialMedia);
userRouter.post("/requests/rescuer", checkRequestExistsForUser, userControllers.makeRescuer);
userRouter.post("/requests/association", checkRequestExistsForUser, userControllers.makeAssociation);
userRouter.get("/requests", showRequest, userControllers.getRequests);

userRouter.use([
    authRouter,
    postRouter,
]);

module.exports = { userRouter }
