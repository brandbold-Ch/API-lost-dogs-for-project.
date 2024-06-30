const authControllers = require('../controllers/authControllers');
const express = require('express');
const { validatorUpdateAuth } = require("../middlewares/joiMiddlewares/authValidator");
const { verifyUpdateAuth } = require("../middlewares/middlewaresFunctions");
const authRouter = express.Router();


authRouter.post("/login", express.urlencoded({extended: true}), authControllers.login);
authRouter.get("/token/status", authControllers.statusToken);
authRouter.put("/auth", express.urlencoded({extended: true}), validatorUpdateAuth, verifyUpdateAuth, authControllers.updateAuth);
authRouter.get("/token/gen", authControllers.refreshToken);

module.exports = { authRouter }
