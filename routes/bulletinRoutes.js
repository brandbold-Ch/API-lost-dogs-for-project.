const {checkBulletinExists, rescuerRolePermission} = require("../middlewares/anyMiddlewares");
const bulletinControllers = require("../controllers/bulletinControllers");
const express = require("express");
const bulletinRouter = express.Router();
const processFormData = require("../middlewares/formData");
const {validateBulletinData} = require("../middlewares/handler/handlerBulletinData");
const {validateQueryDeleteImage} = require("../middlewares/handler/handlerAnyData");


bulletinRouter.use(rescuerRolePermission);

bulletinRouter.post("/bulletins", processFormData, validateBulletinData, bulletinControllers.setBulletin);
bulletinRouter.get("/bulletins", bulletinControllers.getBulletins);
bulletinRouter.get("/bulletins/:bulletin_id", checkBulletinExists, bulletinControllers.getBulletin);
bulletinRouter.delete("/bulletins/:bulletin_id", checkBulletinExists, bulletinControllers.deleteBulletin);
bulletinRouter.put("/bulletins/:bulletin_id", checkBulletinExists, processFormData, validateBulletinData, bulletinControllers.updateBulletin);
bulletinRouter.delete("/bulletins/:bulletin_id/images/", checkBulletinExists, validateQueryDeleteImage, bulletinControllers.deleteImage);

module.exports = {bulletinRouter};
