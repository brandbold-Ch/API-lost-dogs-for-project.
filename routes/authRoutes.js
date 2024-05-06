const authControllers = require('../controllers/authControllers');
const express = require('express');
const {validateUpdateAuthData} = require("../middlewares/handlerInputData/handlerAuthData");
const {verifyUpdateAuth} = require("../middlewares/generalMiddlewares");
const authRouter = express.Router();


authRouter.post('/login', express.urlencoded({extended: true}), authControllers.login);
authRouter.post('/status/token', authControllers.statusToken);
authRouter.put("/auth", express.urlencoded({extended: true}), validateUpdateAuthData, verifyUpdateAuth, authControllers.updateAuth);


module.exports = {authRouter};
