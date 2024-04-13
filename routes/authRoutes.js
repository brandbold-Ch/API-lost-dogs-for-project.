const {checkUserExists} = require('../middlewares/entityManager');
const authControllers = require('../controllers/authControllers');
const isAuthenticate = require('../middlewares/authenticator');
const express = require('express');
const authRouter = express.Router();


authRouter.post('/login', express.urlencoded({extended: true}), authControllers.login);
authRouter.post('/status/token', authControllers.statusToken);

module.exports = {authRouter};
