const {checkUserExists, checkPostExists, isActive} = require("../middlewares/entityManager");
const {checkQueryParameters} = require("../middlewares/entityManager");
const postControllers = require("../controllers/postControllers");
const express = require("express");
const postRouter = express.Router();
const processFormData = require("../middlewares/formData");
const isAuthenticate = require("../middlewares/authenticator");


//postRouter.post("/", isAuthenticate, checkUserExists, isActive, processFormData, postControllers.setPost);
postRouter.put("/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, processFormData, postControllers.updatePost);
postRouter.get("/all", isAuthenticate, checkUserExists, isActive, postControllers.getPosts);
postRouter.get("/filter/gender", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostGender);
postRouter.get("/filter/breed", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostBreed);
postRouter.get("/filter/size", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostSize);
postRouter.get("/filter/owner", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostOwner);
postRouter.get("/filter/found", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostFound);
postRouter.get("/filter/specie", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostSpecie);
postRouter.get("/filter/date", isAuthenticate, checkUserExists, isActive, postControllers.getFilterPostLostDate);
postRouter.get("/filter/year", isAuthenticate, checkUserExists, isActive, postControllers.getFilterPostYear);
postRouter.get("/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, postControllers.getPost);
postRouter.delete("/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, postControllers.deletePost);
postRouter.post("/gallery/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, processFormData, postControllers.addGallery);
postRouter.delete("/gallery/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, postControllers.delPartialGallery);
postRouter.post("/comment", isAuthenticate, checkUserExists, isActive, checkPostExists, express.text(), postControllers.insertComment);

module.exports = {postRouter};
