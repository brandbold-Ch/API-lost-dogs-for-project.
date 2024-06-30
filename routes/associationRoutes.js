const associationControllers = require("../controllers/associationControllers");
const { rescuerDataValidator } = require("../middlewares/joiMiddlewares/rescuerValidator");
const { Authenticate } = require('../middlewares/authenticator');
const { postRouter } = require("./postRoutes");
const { bulletinRouter } = require("./bulletinRoutes");
const processFormData = require("../middlewares/formData");
const { blogRouter } = require("./blogRoutes");
const { authRouter } = require("./authRoutes");
const express = require("express");
const associationRouter = express.Router();
const {
    checkEntityExists,
    checkAccountExists,
    specialPermissions,
} = require("../middlewares/middlewaresFunctions");


associationRouter.post(
    "/", processFormData,
    rescuerDataValidator,
    checkAccountExists,
    associationControllers.createRescuer
);

associationRouter.use([
    Authenticate,
    checkEntityExists,
    specialPermissions
]);

associationRouter.get("/", associationControllers.getRescuer);
associationRouter.delete("/", associationControllers.deleteRescuer);
associationRouter.delete("/networks", associationControllers.deleteSocialMedia);
associationRouter.delete("/image/:image_id", associationControllers.deleteImage);
associationRouter.put("/", processFormData, rescuerDataValidator, associationControllers.updateRescuer);

associationRouter.use([
    authRouter,
    postRouter,
    bulletinRouter,
    blogRouter
]);

module.exports = { associationRouter }
