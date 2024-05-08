const authControllers = require('../controllers/authControllers');
const express = require('express');
const {validateUpdateAuthData} = require("../middlewares/handlerInputData/handlerAuthData");
const {verifyUpdateAuth} = require("../middlewares/generalMiddlewares");
const authRouter = express.Router();
const {Authenticate} = require("../middlewares/authenticator");


authRouter.post("/login", express.urlencoded({extended: true}), authControllers.login);
authRouter.get("/token/status", authControllers.statusToken);
authRouter.put("/auth", express.urlencoded({extended: true}), validateUpdateAuthData, verifyUpdateAuth, authControllers.updateAuth);
authRouter.get("/token/gen", authControllers.refreshToken);

module.exports = {authRouter};
