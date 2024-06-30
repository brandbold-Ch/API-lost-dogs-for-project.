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
    associationControllers.createAssociation
);

associationRouter.use([
    Authenticate,
    checkEntityExists,
    specialPermissions
]);

associationRouter.get("/", associationControllers.getAssociation);
associationRouter.delete("/", associationControllers.deleteAssociation);
associationRouter.delete("/networks", associationControllers.deleteSocialMedia);
associationRouter.delete("/image/:image_id", associationControllers.deleteImage);
associationRouter.put("/", processFormData, rescuerDataValidator, associationControllers.updateAssociation);
associationRouter.post("/rescuers/:rescuer_id", associationControllers.addResCollab);
associationRouter.get("/rescuers", associationControllers.getRescuers);

associationRouter.use([
    authRouter,
    postRouter,
    bulletinRouter,
    blogRouter
]);

module.exports = { associationRouter }
