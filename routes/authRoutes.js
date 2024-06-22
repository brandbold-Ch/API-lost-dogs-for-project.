const authControllers = require('../controllers/authControllers');
const express = require('express');
const {validateUpdateAuthData} = require("../middlewares/handler/handlerAuthData");
const {verifyUpdateAuth} = require("../middlewares/anyMiddlewares");
const authRouter = express.Router();


authRouter.post("/login", express.urlencoded({extended: true}), authControllers.login);
authRouter.get("/token/status", authControllers.statusToken);
authRouter.put("/auth", express.urlencoded({extended: true}), validateUpdateAuthData, verifyUpdateAuth, authControllers.updateAuth);
authRouter.get("/token/gen", authControllers.refreshToken);

module.exports = {authRouter};
