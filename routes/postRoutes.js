const { checkPostExists, checkQueryParameters } = require("../middlewares/middlewaresFunctions");
const postControllers = require("../controllers/postControllers");
const express = require("express");
const postRouter = express.Router();
const processFormData = require("../middlewares/formData");
const { postDataValidator } = require("../middlewares/joiMiddlewares/postValidator");
const { validateQueryDeleteImage } = require("../middlewares/joiMiddlewares/anyValidator");


postRouter.post("/posts", processFormData, postDataValidator, postControllers.createPost);
postRouter.get("/posts/:pet_id", checkPostExists, postControllers.getPost);
postRouter.put("/posts/:pet_id", checkPostExists, processFormData, postDataValidator, postControllers.updatePost);
postRouter.delete("/posts/:pet_id", checkPostExists, postControllers.deletePost);
postRouter.get("/posts", postControllers.getPosts);
postRouter.get("/posts/search/chrt", checkQueryParameters, postControllers.filterPosts);
postRouter.delete("/posts/:pet_id/images", checkPostExists, validateQueryDeleteImage, postControllers.deleteImage);
postRouter.post("/posts/comment/:pet_id", express.text(), postControllers.insertComment);

module.exports = { postRouter }
