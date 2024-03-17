const { checkUserExists, isActive, checkBulletinExists, checkPostExists} = require("../middlewares/entityManager");
const bulletinControllers = require("../controllers/bulletinControllers");
const express = require("express");
const bulletinRoute = express.Router();
const processFormData = require("../middlewares/formData");
const isAuthenticate = require("../middlewares/authenticate");
const postControllers = require("../controllers/postControllers");


bulletinRoute.post("/", isAuthenticate, checkUserExists, isActive, processFormData, bulletinControllers.setBulletin);
bulletinRoute.get("/all", isAuthenticate, checkUserExists, isActive, bulletinControllers.getBulletins);
bulletinRoute.get("/:bulletin_id", isAuthenticate, checkUserExists, isActive, checkBulletinExists, bulletinControllers.getBulletin);
bulletinRoute.put("/:bulletin_id", isAuthenticate, checkUserExists, isActive, checkBulletinExists, processFormData, bulletinControllers.updateBulletin);
bulletinRoute.delete("/:bulletin_id", isAuthenticate, checkUserExists, isActive, checkBulletinExists, bulletinControllers.deleteBulletin);
bulletinRoute.delete("/gallery/:bulletin_id", isAuthenticate, checkUserExists, checkBulletinExists, bulletinControllers.delPartialGallery);


module.exports = bulletinRoute;