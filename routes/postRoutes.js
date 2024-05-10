const {checkPostExists, checkQueryParameters, userRolePermission} = require("../middlewares/anyMiddlewares");
const postControllers = require("../controllers/postControllers");
const express = require("express");
const postRouter = express.Router();
const processFormData = require("../middlewares/formData");
const {validatePostData} = require("../middlewares/handlerInputData/handlerPostData");
const {validateQueryDeleteImage} = require("../middlewares/handlerInputData/handlerAnyData");


postRouter.post("/posts", processFormData, validatePostData, postControllers.setPost);
postRouter.get("/posts/:pet_id", checkPostExists, postControllers.getPost);
postRouter.put("/posts/:pet_id", checkPostExists, processFormData, validatePostData, postControllers.updatePost);
postRouter.delete("/posts/:pet_id", checkPostExists, postControllers.deletePost);
postRouter.get("/posts", postControllers.getPosts);
postRouter.get("/posts/search/chrt", checkQueryParameters, postControllers.filterPosts);
postRouter.delete("/posts/images/:pet_id", checkPostExists, validateQueryDeleteImage, postControllers.deleteImage);
postRouter.post("/posts/comment/:pet_id", express.text(), postControllers.insertComment);

module.exports = {postRouter};
