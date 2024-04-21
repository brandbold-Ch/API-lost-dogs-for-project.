const {checkPostExists, isActive, checkQueryParameters, checkEntityExists} = require("../middlewares/generalMiddlewares");
const postControllers = require("../controllers/postControllers");
const express = require("express");
const postRouter = express.Router();
const processFormData = require("../middlewares/formData");
const {Authenticate} = require("../middlewares/authenticator");


module.exports = {postRouter};
