const rescuerControllers = require("../controllers/rescuerControllers");
const { rescuerDataValidator } = require("../middlewares/joiMiddlewares/rescuerValidator");
const { Authenticate } = require("../middlewares/authenticator");
const { postRouter } = require("./postRoutes");
const { bulletinRouter } = require("./bulletinRoutes");
const processFormData = require("../middlewares/formData");
const { blogRouter } = require("./blogRoutes");
const { authRouter } = require("./authRoutes");
const express = require("express");
const rescuerRouter = express.Router();
const {
    checkEntityExists,
    checkAccountExists,
    specialPermissions,
} = require("../middlewares/middlewaresFunctions");


rescuerRouter.post(
    "/", processFormData,
    rescuerDataValidator,
    checkAccountExists,
    rescuerControllers.createRescuer
);

rescuerRouter.use([
    Authenticate,
    checkEntityExists,
    specialPermissions
]);

rescuerRouter.get("/", rescuerControllers.getRescuer);
rescuerRouter.delete("/", rescuerControllers.deleteRescuer);
rescuerRouter.delete("/networks", rescuerControllers.deleteSocialMedia);
rescuerRouter.delete("/image/:image_id", rescuerControllers.deleteImage);
rescuerRouter.put("/", processFormData, rescuerDataValidator, rescuerControllers.updateRescuer);

rescuerRouter.use([
    authRouter,
    postRouter,
    bulletinRouter,
    blogRouter
]);

module.exports = { rescuerRouter }
