const {checkPostExists, checkQueryParameters, userRolePermission} = require("../middlewares/generalMiddlewares");
const postControllers = require("../controllers/postControllers");
const express = require("express");
const postRouter = express.Router();
const processFormData = require("../middlewares/formData");
const {validatePostData} = require("../middlewares/handlerInputData/handlerPostData");
const {validateQueryDeleteImage} = require("../middlewares/handlerInputData/handlerAnyData");


postRouter.use(userRolePermission);

postRouter.post("/posts", processFormData, validatePostData, postControllers.setPost);

postRouter.get("/posts/:pet_id", checkPostExists, postControllers.getPost);

postRouter.put("/posts/:pet_id", checkPostExists, processFormData, validatePostData, postControllers.updatePost);

postRouter.delete("/posts/:pet_id", checkPostExists, postControllers.deletePost);

postRouter.get("/posts", postControllers.getPosts);

postRouter.get("/posts/filter/gender", checkQueryParameters, postControllers.getFilterPostGender);

postRouter.get("/posts/filter/breed", checkQueryParameters, postControllers.getFilterPostBreed);

postRouter.get("/posts/filter/size", checkQueryParameters, postControllers.getFilterPostSize);

postRouter.get("/posts/filter/owner", checkQueryParameters, postControllers.getFilterPostOwner);

postRouter.get("/posts/filter/found", checkQueryParameters, postControllers.getFilterPostFound);

postRouter.get("/posts/filter/specie", checkQueryParameters, postControllers.getFilterPostSpecie);

postRouter.get("/posts/filter/date", postControllers.getFilterPostLostDate);

postRouter.get("/posts/filter/year", postControllers.getFilterPostYear);

postRouter.delete("/posts/images/:pet_id", checkPostExists, validateQueryDeleteImage, postControllers.deleteImage);

postRouter.post("/posts/comment/:pet_id", express.text(), postControllers.insertComment);


module.exports = {postRouter};
