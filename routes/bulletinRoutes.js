const { checkBulletinExists, specialPermissions } = require("../middlewares/middlewaresFunctions");
const bulletinControllers = require("../controllers/bulletinControllers");
const express = require("express");
const bulletinRouter = express.Router();
const processFormData = require("../middlewares/formData");
const { bulletinDataValidator } = require("../middlewares/joiMiddlewares/bulletinValidator");
const { validateQueryDeleteImage } = require("../middlewares/joiMiddlewares/anyValidator");


bulletinRouter.use(specialPermissions);

bulletinRouter.post("/bulletins", processFormData, bulletinDataValidator, bulletinControllers.createBulletin);
bulletinRouter.get("/bulletins", bulletinControllers.getBulletins);
bulletinRouter.get("/bulletins/:bulletin_id", checkBulletinExists, bulletinControllers.getBulletin);
bulletinRouter.delete("/bulletins/:bulletin_id", checkBulletinExists, bulletinControllers.deleteBulletin);
bulletinRouter.put("/bulletins/:bulletin_id", checkBulletinExists, processFormData, bulletinDataValidator, bulletinControllers.updateBulletin);
bulletinRouter.delete("/bulletins/:bulletin_id/images/", checkBulletinExists, validateQueryDeleteImage, bulletinControllers.deleteImage);

module.exports = { bulletinRouter }
