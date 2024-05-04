const userControllers = require('../controllers/userControllers');
const {postRouter} = require("./postRoutes");
const {bulletinRouter} = require("./bulletinRoutes");const {Authenticate} = require('../middlewares/authenticator');
const {authRouter} = require("./authRoutes");
const {validateUserData} = require("../middlewares/handlerInputData/handlerUserData");
const express = require('express');
const userRouter = express.Router();
const {
    checkEntityExists,
    checkAccountExists,
    checkRequestExistsForUser,
    seeRequest
} = require('../middlewares/generalMiddlewares');


/**
 * @swagger
 * /api/v2/users:
 *   post:
 *     tags:
 *       - User controllers
 *     summary: Crear usuario.
 *     description: Creación de usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *               lastname:
 *                 type: string
 *                 description: Apellido del usuario.
 *               cellphone:
 *                 type: string
 *                 description: Número de celular del usuario.
 *               social_networks:
 *                 type: object
 *                 description: Objeto de redes sociales.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *             example:
 *               name: John
 *               lastname: Doe
 *               cellphone: "123456789"
 *               social_networks:
 *                 facebook: john.doe
 *                 twitter: "@john_doe"
 *               email: john@example.com
 *               password: secretpassword
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *       500:
 *         description: Error interno del servidor.
 *       400:
 *         description: Error del cliente.
 */
userRouter.post("/", express.urlencoded({extended: true}), validateUserData, checkAccountExists, userControllers.setUser);

userRouter.use([
    Authenticate,
    checkEntityExists
]);

/**
 * @swagger
 * /api/v2/users/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User controllers
 *     summary: Obener un usuario.
 *     description: Obtener los datos de un usuario.
 *     responses:
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Usuario no encontrado.
 *       200:
 *         description: Datos del usuario.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
userRouter.get("/", userControllers.getUser);

/**
 * @swagger
 * /api/v2/users/:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User controllers
 *     summary: Eliminar un usuario.
 *     description: Eliminar un usuario usuario.
 *     responses:
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Usuario no encontrado.
 *       204:
 *         description: Usuario eliminado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
userRouter.delete("/", userControllers.deleteUser);

/**
 * @swagger
 * /api/v2/users/:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User controllers
 *     summary: Actualizar datos de usuario.
 *     description: Actualizar datos de usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *               lastname:
 *                 type: string
 *                 description: Apellido del usuario.
 *               cellphone:
 *                 type: string
 *                 description: Número de celular del usuario.
 *               social_networks:
 *                 type: object
 *                 description: Objeto de redes sociales.
 *             example:
 *               name: John
 *               lastname: Doe
 *               cellphone: "123456789"
 *               social_networks:
 *                 facebook: john.doe
 *                 twitter: "@john_doe"
 *     responses:
 *       202:
 *         description: Datos de usuario actualizados.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
userRouter.put("/", express.urlencoded({extended: true}), validateUserData, userControllers.updateUser);

/**
 * @swagger
 * /api/v2/users/networks:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User controllers
 *     summary: Eliminar una red social.
 *     description: Eliminar una red social de usuario.
 *     parameters:
 *       - in: query
 *         name: key
 *         description: Nombre de la red social (key).
 *         required: true
 *         type: string
 *       - in: query
 *         name: value
 *         description: Usuario de la red social (value).
 *         required: true
 *         type: string
 *     responses:
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Usuario no encontrado.
 *       204:
 *         description: Red social eliminada.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
userRouter.delete('/networks', userControllers.deleteSocialMedia);

/**
 * @swagger
 * /api/v2/users/requests:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User controllers
 *     summary: Crear solcitud de rescatista.
 *     description: Creación de solicitud para ser rescatista.
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente.
 *       500:
 *         description: Error interno del servidor.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.post("/requests", checkRequestExistsForUser, userControllers.makeRescuer);

/**
 * @swagger
 * /api/v2/users/requests:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User controllers
 *     summary: Ver solicitudes.
 *     description: Ver solicitudes pendientes.
 *     responses:
 *       201:
 *         description: Solicitud .
 *       500:
 *         description: Error interno del servidor.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Solicitudes no encontradas o Usuario no encontrado.
 */
userRouter.get("/requests", seeRequest, userControllers.getRequests);

/**
 * @swagger
 * /api/v2/users/auth:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User controllers
 *     summary: Actualizar las credenciales de un usuario.
 *     description: Actualizar el email y contraseña de un usuario.
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
 *               new_password:
 *                 type: string
 *                 description: Nueva contraseña para el usuario.
 *               old_password:
 *                 type: string
 *                 description: Actual contraseña del usuario.
 *     responses:
 *       202:
 *         description: Credenciales modificadas.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /api/v2/users/posts:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User controllers
 *     summary: Crear una mascota
 *     description: Crea una nueva mascota en la base de datos.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specie:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Macho, Hembra]
 *               age:
 *                 type: string
 *               description:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [Chico, Mediano, Grande, No aplica]
 *               breed:
 *                 type: string
 *               lost_date:
 *                 type: string
 *               coordinates:
 *                 type: string
 *               last_seen:
 *                 type: string
 *               owner:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Mascota creada correctamente.
 *       500:
 *         description: Error interno del servidor.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.use([
    authRouter,
    postRouter,
    bulletinRouter
]);

module.exports = {userRouter};
