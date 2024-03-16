const { checkUserExists } = require("../middlewares/entityManager");
const { checkPostExists } = require("../middlewares/entityManager");
const { checkQueryParameters } = require("../middlewares/entityManager");
const postControllers = require("../controllers/postControllers");
const express = require("express");
const petsRoute = express.Router();
const processFormData = require("../middlewares/formData");
const isAuthenticate = require("../middlewares/authenticate");


petsRoute.post("/", isAuthenticate, checkUserExists, processFormData, postControllers.insertLostPet);
petsRoute.put("/:pet_id", isAuthenticate, checkUserExists, checkPostExists, processFormData, postControllers.updatePost);
petsRoute.get("/all", isAuthenticate, checkUserExists, postControllers.getPosts);
petsRoute.get("/filter/gender", isAuthenticate, checkUserExists, checkQueryParameters, postControllers.getFilterPostGender);
petsRoute.get("/filter/breed", isAuthenticate, checkUserExists,checkQueryParameters, postControllers.getFilterPostBreed);
petsRoute.get("/filter/size", isAuthenticate, checkUserExists, checkQueryParameters, postControllers.getFilterPostSize);
petsRoute.get("/filter/owner", isAuthenticate, checkUserExists, checkQueryParameters, postControllers.getFilterPostOwner);
petsRoute.get("/filter/found", isAuthenticate, checkUserExists, checkQueryParameters, postControllers.getFilterPostFound);
petsRoute.get("/filter/specie", isAuthenticate, checkUserExists, checkQueryParameters, postControllers.getFilterPostSpecie);
petsRoute.get("/:pet_id", isAuthenticate, checkUserExists, checkPostExists, postControllers.getPost);
petsRoute.delete("/:pet_id", isAuthenticate, checkUserExists, checkPostExists, postControllers.deletePost);
petsRoute.post("/gallery/:pet_id", isAuthenticate, checkUserExists, checkPostExists, processFormData, postControllers.addGallery);
petsRoute.delete("/gallery/:pet_id", isAuthenticate, checkUserExists, checkPostExists, postControllers.delPartialGallery);
petsRoute.post("/comment/", isAuthenticate, checkUserExists, checkPostExists, express.text() ,postControllers.insertComment);

module.exports = petsRoute;
