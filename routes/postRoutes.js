const { checkUserExists, checkPostExists, isActive } = require("../middlewares/entityManager");
const { checkQueryParameters } = require("../middlewares/entityManager");
const postControllers = require("../controllers/postControllers");
const express = require("express");
const petsRoute = express.Router();
const processFormData = require("../middlewares/formData");
const isAuthenticate = require("../middlewares/authenticate");


petsRoute.post("/", isAuthenticate, checkUserExists, isActive, processFormData, postControllers.insertLostPet);
petsRoute.put("/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, processFormData, postControllers.updatePost);
petsRoute.get("/all", isAuthenticate, checkUserExists, isActive, postControllers.getPosts);
petsRoute.get("/filter/gender", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostGender);
petsRoute.get("/filter/breed", isAuthenticate, checkUserExists, isActive,checkQueryParameters, postControllers.getFilterPostBreed);
petsRoute.get("/filter/size", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostSize);
petsRoute.get("/filter/owner", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostOwner);
petsRoute.get("/filter/found", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostFound);
petsRoute.get("/filter/specie", isAuthenticate, checkUserExists, isActive, checkQueryParameters, postControllers.getFilterPostSpecie);
petsRoute.get("/filter/date", isAuthenticate, checkUserExists, isActive, postControllers.getFilterPostLostDate);
petsRoute.get("/filter/year", isAuthenticate, checkUserExists, isActive, postControllers.getFilterPostYear);
petsRoute.get("/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, postControllers.getPost);
petsRoute.delete("/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, postControllers.deletePost);
petsRoute.post("/gallery/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, processFormData, postControllers.addGallery);
petsRoute.delete("/gallery/:pet_id", isAuthenticate, checkUserExists, isActive, checkPostExists, postControllers.delPartialGallery);
petsRoute.post("/comment/", isAuthenticate, checkUserExists, isActive, checkPostExists, express.text() ,postControllers.insertComment);

module.exports = petsRoute;
