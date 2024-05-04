const authControllers = require('../controllers/authControllers');
const express = require('express');
const {validateUpdateAuthData} = require("../middlewares/handlerInputData/handlerAuthData");
const {verifyUpdateAuth} = require("../middlewares/generalMiddlewares");
const authRouter = express.Router();


/**
 * @swagger
 * /api/v2/auth/login:
 *   post:
 *     tags:
 *       - Auth controllers
 *     summary: Iniciar sesión.
 *     description: Obtener token de autorización.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       200:
 *         description: Token generado exitosamente.
 *       500:
 *         description: Error interno del servidor.
 *       400:
 *         description: Error del cliente.
 *       401:
 *         description: Contraseña incorrecta.
 *       404:
 *         description: El usuario no existe.
 */
authRouter.post('/login', express.urlencoded({extended: true}), authControllers.login);


authRouter.post('/status/token', authControllers.statusToken);


authRouter.put("/auth", express.urlencoded({extended: true}), validateUpdateAuthData, verifyUpdateAuth, authControllers.updateAuth);


module.exports = {authRouter};
