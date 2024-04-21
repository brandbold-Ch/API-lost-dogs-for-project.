const authControllers = require('../controllers/authControllers');
const express = require('express');
const authRouter = express.Router();


authRouter.post('/login', express.urlencoded({extended: true}), authControllers.login);
authRouter.post('/status/token', authControllers.statusToken);

module.exports = {authRouter};
