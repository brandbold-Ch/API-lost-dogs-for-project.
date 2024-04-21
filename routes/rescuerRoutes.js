const rescuerControllers = require("../controllers/rescuerControllers");
const bulletinControllers = require("../controllers/bulletinControllers");
const postControllers = require("../controllers/postControllers");
const processFormData = require("../middlewares/formData");
const {Authenticate} = require("../middlewares/authenticator");
const express = require("express");
const rescuerRouter = express.Router();
const {
    checkEntityExists,
    isActive,
    checkBulletinExists,
    checkQueryParameters,
    checkPostExists
} = require("../middlewares/generalMiddlewares");


rescuerRouter.post("/", express.urlencoded({extended: true}), rescuerControllers.setRescuer);

rescuerRouter.use([
    Authenticate,
    checkEntityExists,
    isActive
]);

rescuerRouter.get("/", rescuerControllers.getRescuer);
rescuerRouter.delete("/", rescuerControllers.deleteRescuer);
rescuerRouter.put("/", express.urlencoded({extended: true}), rescuerControllers.updateRescuer);

rescuerRouter.post("/posts", processFormData, postControllers.setPost);
rescuerRouter.get("/posts/:pet_id", checkPostExists, postControllers.getPost);
rescuerRouter.put("/posts/:pet_id", checkPostExists, processFormData, postControllers.updatePost);
rescuerRouter.delete("/posts/:pet_id", checkPostExists, postControllers.deletePost);

rescuerRouter.get("/posts", postControllers.getPosts);
rescuerRouter.get("/posts/filter/gender", checkQueryParameters, postControllers.getFilterPostGender);
rescuerRouter.get("/posts/filter/breed", checkQueryParameters, postControllers.getFilterPostBreed);
rescuerRouter.get("/posts/filter/size", checkQueryParameters, postControllers.getFilterPostSize);
rescuerRouter.get("/posts/filter/owner", checkQueryParameters, postControllers.getFilterPostOwner);
rescuerRouter.get("/posts/filter/found", checkQueryParameters, postControllers.getFilterPostFound);
rescuerRouter.get("/posts/filter/specie", checkQueryParameters, postControllers.getFilterPostSpecie);
rescuerRouter.get("/posts/filter/date", postControllers.getFilterPostLostDate);
rescuerRouter.get("/posts/filter/year", postControllers.getFilterPostYear);

rescuerRouter.post("/posts/gallery/:pet_id", checkPostExists, processFormData, postControllers.addGallery);
rescuerRouter.delete("/posts/gallery/:pet_id", checkPostExists, postControllers.delPartialGallery);
rescuerRouter.post("/posts/comment", checkPostExists, express.text(), postControllers.insertComment);

rescuerRouter.post("/bulletins", processFormData, bulletinControllers.setBulletin);
rescuerRouter.get("/bulletins", bulletinControllers.getBulletins);
rescuerRouter.get("/bulletins/:bulletin_id", checkBulletinExists, bulletinControllers.getBulletin);
rescuerRouter.delete("/bulletins/:bulletin_id", checkBulletinExists, bulletinControllers.deleteBulletin);

rescuerRouter.put("/bulletins/:bulletin_id", checkBulletinExists, processFormData, bulletinControllers.updateBulletin);
rescuerRouter.delete("/bulletins/gallery/:bulletin_id", checkBulletinExists, bulletinControllers.delPartialGallery);

module.exports = {rescuerRouter};
