const {checkBulletinExists} = require("../middlewares/entityManager");
const bulletinControllers = require("../controllers/bulletinControllers");
const express = require("express");
const bulletinRouter = express.Router();
const processFormData = require("../middlewares/formData");


bulletinRouter.post("/", processFormData, bulletinControllers.setBulletin);
bulletinRouter.get("/", bulletinControllers.getBulletins);
bulletinRouter.get("/:bulletin_id", checkBulletinExists, bulletinControllers.getBulletin);
bulletinRouter.put("/:bulletin_id", checkBulletinExists, processFormData, bulletinControllers.updateBulletin);
bulletinRouter.delete("/:bulletin_id", checkBulletinExists, bulletinControllers.deleteBulletin);

bulletinRouter.delete("/gallery/:bulletin_id", checkBulletinExists, bulletinControllers.delPartialGallery);

module.exports = {bulletinRouter};
