const {Authenticate} = require("../middlewares/authenticator");
const adminControllers = require("../controllers/adminControllers");
const {authRouter} = require("./authRoutes");
const {validateQueryAction} = require("../middlewares/handlerInputData/handlerAnyData");
const {validateSetAdminData} = require("../middlewares/handlerInputData/handlerAdminData");
const express = require("express");
const adminRouter = express.Router();
const {
    checkEntityExists,
    checkRequestExists,
    checkQueryStatus,
    checkAccountExists
} = require("../middlewares/generalMiddlewares");


/**
 * @swagger
 * /api/v2/admins:
 *   post:
 *     tags:
 *       - Admin controllers
 *     summary: Crear usuario administrador.
 *     description: Creación de usuario administrador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del administrador.
 *               lastname:
 *                 type: string
 *                 description: Apellido del administrador.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del administrador.
 *               password:
 *                 type: string
 *                 description: Contraseña del administrador.
 *               token:
 *                 type: string
 *                 description: Token de acceso.
 *     responses:
 *       201:
 *         description: Administrador creado correctamente.
 *       500:
 *         description: Error interno del servidor.
 *       400:
 *         description: Error del cliente.
 */
adminRouter.post("/", express.urlencoded({extended: true}), validateSetAdminData, checkAccountExists, adminControllers.setAdmin);

adminRouter.use([
    Authenticate,
    checkEntityExists
]);


/**
 * @swagger
 * /api/v2/admins/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin controllers
 *     summary: Obtener un administrador.
 *     description: Obtener los datos de un administrador.
 *     responses:
 *       200:
 *         description: Datos del administrador.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Administrador no encontrado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.get("/", adminControllers.getAdmin);

/**
 * @swagger
 * /api/v2/admins/:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin controllers
 *     summary: Eliminar administrador.
 *     description: Eliminar usuario administrador.
 *     responses:
 *       204:
 *         description: Administrador eliminado.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Administrador no encontrado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.delete("/", adminControllers.delAdmin);

/**
 * @swagger
 * /api/v2/admins/:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin controllers
 *     summary: Actualizar datos de administrador.
 *     description: Actualziar datos de usuario administrador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del administrador.
 *               lastname:
 *                 type: string
 *                 description: Apellido del administrador.
 *     responses:
 *       204:
 *         description: Administrador eliminado.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Administrador no encontrado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.put("/", express.urlencoded({extended: true}), adminControllers.updateAdmin);

/**
 * @swagger
 * /api/v2/admins/auth:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin controllers
 *     summary: Obtener las credenciales de un administrador.
 *     description: Obtener el email y contraseña de un usuario administrador.
 *     responses:
 *       200:
 *         description: Credenciales.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Administrador no encontrado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.use(authRouter);

/**
 * @swagger
 * /api/v2/admins/requests:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin controllers
 *     summary: Obtener las solicitudes de rescatistas.
 *     description: Obtener todas las solicitudes de rescatistas.
 *     responses:
 *       200:
 *         description: Todas las solicitudes.
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Administrador no encontrado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.get("/requests", adminControllers.getRequests);

/**
 * @swagger
 * /api/v2/admins/requests/{req_id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin controllers
 *     summary: Eliminar solicitud.
 *     description: Eliminar solicitud de rescatista.
 *     parameters:
 *       - in: path
 *         name: req_id
 *         description: Id de solicitud.
 *         required: true
 *         type: string
 *     responses:
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Solicitud no encontrado.
 *       204:
 *         description: Solicitud eliminado.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.delete("/requests/:req_id", adminControllers.deleteRequest);

/**
 * @swagger
 * /api/v2/admins/requests/{req_id}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin controllers
 *     summary: Acciones para solicitudes.
 *     description: Activar, rechazar o desactivar solicitud.
 *     parameters:
 *       - in: path
 *         name: req_id
 *         description: Id de solicitud.
 *         required: true
 *         type: string
 *       - in: query
 *         name: action
 *         description: Opción para la solicitud
 *         type: string
 *         required: true
 *         example: activate, reject, deactivate
 *     responses:
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Solicitud no encontrado.
 *       200:
 *         description: Solicitud modificada.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.post("/requests/:req_id", checkRequestExists, validateQueryAction, adminControllers.actionRequest);

/**
 * @swagger
 * /api/v2/admins/requests/filter:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin controllers
 *     summary: Filtrar solicitudes.
 *     description: Filtro de solicitudes (active, rejected, disabled, pending) .
 *     parameters:
 *       - in: query
 *         name: status
 *         description: Opción de filtro
 *         type: string
 *         required: true
 *         example: active, rejected, deactivated, pending
 *     responses:
 *       400:
 *         description: Error del cliente.
 *       404:
 *         description: Solicitud no encontrado.
 *       200:
 *         description: Solicitudes filtradas.
 *       401:
 *         description: Sin permisos para ver esta ruta.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.get("/requests/filter", checkQueryStatus, adminControllers.filterRequests);

adminRouter.get("/rescuers", adminControllers.getRescuers);
adminRouter.get("/rescuers/:rescuer_id", adminControllers.getRescuer);
adminRouter.delete("/rescuers/:rescuer_id", adminControllers.deleteRescuer);

adminRouter.get("/users", adminControllers.getUsers);
adminRouter.get("/users/:user_id", adminControllers.getUser);
adminRouter.delete("/users/:user_id", adminControllers.deleteUser);

module.exports = {adminRouter};
