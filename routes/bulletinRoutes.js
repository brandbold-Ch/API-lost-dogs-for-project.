const { checkUserExists, isActive} = require("../middlewares/entityManager");
const bulletinControllers = require("../controllers/bulletinControllers");
const express = require("express");
const bulletinRoute = express.Router();
const processFormData = require("../middlewares/formData");
const isAuthenticate = require("../middlewares/authenticate");


bulletinRoute.post("/", isAuthenticate, checkUserExists, isActive, processFormData, bulletinControllers.setBulletin);
bulletinRoute.get("/all", isAuthenticate, checkUserExists, isActive, bulletinControllers.getBulletins);
bulletinRoute.get("/:bulletin_id", isAuthenticate, checkUserExists, isActive, bulletinControllers.getBulletin);
bulletinRoute.put("/:bulletin_id", isAuthenticate, checkUserExists, isActive, processFormData, bulletinControllers.updateBulletin);
bulletinRoute.delete("/:bulletin_id", isAuthenticate, checkUserExists, isActive, bulletinControllers.deleteBulletin);


module.exports = bulletinRoute;