const rescuerControllers = require("../controllers/rescuerControllers");
const {validateRescuerData} = require("../middlewares/handlerInputData/handlerRescuerData");
const {Authenticate} = require('../middlewares/authenticator');
const {postRouter} = require("./postRoutes");
const {bulletinRouter} = require("./bulletinRoutes");
const {authRouter} = require("./authRoutes");
const express = require("express");
const rescuerRouter = express.Router();
const {
    checkEntityExists,
    checkAccountExists,
    rescuerRolePermission,
} = require("../middlewares/anyMiddlewares");


rescuerRouter.post("/", express.urlencoded({extended: true}), validateRescuerData, checkAccountExists, rescuerControllers.setRescuer);

rescuerRouter.use([
    Authenticate,
    checkEntityExists,
    rescuerRolePermission
]);

rescuerRouter.get("/", rescuerControllers.getRescuer);
rescuerRouter.delete("/", rescuerControllers.deleteRescuer);
rescuerRouter.put("/", express.urlencoded({extended: true}), validateRescuerData, rescuerControllers.updateRescuer);

rescuerRouter.use([
    authRouter,
    postRouter,
    bulletinRouter
]);

module.exports = {rescuerRouter};
