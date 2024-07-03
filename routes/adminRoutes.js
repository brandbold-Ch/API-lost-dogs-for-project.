const { Authenticate } = require("../middlewares/authenticator");
const adminControllers = require("../controllers/adminControllers");
const { authRouter } = require("./authRoutes");
const { validateQueryAction } = require("../middlewares/joiMiddlewares/anyValidator");
const { adminDataValidator } = require("../middlewares/joiMiddlewares/adminValidator");
const express = require("express");
const adminRouter = express.Router();
const {
    checkEntityExists,
    checkRequestExists,
    checkQueryStatus,
    checkAccountExists,
    entityExists
} = require("../middlewares/middlewaresFunctions");


adminRouter.post("/", express.urlencoded({ extended: true }), adminDataValidator, checkAccountExists, adminControllers.createAdmin);

adminRouter.use([
    Authenticate,
    checkEntityExists
]);

adminRouter.get("/", adminControllers.getAdmin);
adminRouter.delete("/", adminControllers.delAdmin);
adminRouter.put("/", express.urlencoded({extended: true}), adminControllers.updateAdmin);
adminRouter.get("/requests", adminControllers.getRequests);
adminRouter.delete("/requests/:req_id", checkRequestExists, adminControllers.deleteRequest);
adminRouter.post("/requests/:req_id", checkRequestExists, validateQueryAction, adminControllers.actionRequest);
adminRouter.get("/requests/search", checkQueryStatus, adminControllers.filterRequests);
adminRouter.get("/rescuers", adminControllers.getRescuers);
adminRouter.get("/rescuers/:rescuer_id", entityExists, adminControllers.getRescuer);
adminRouter.delete("/rescuers/:rescuer_id", entityExists, adminControllers.deleteRescuer);
adminRouter.get("/users", adminControllers.getUsers);
adminRouter.get("/users/:user_id", entityExists, adminControllers.getUser);
adminRouter.delete("/users/:user_id", entityExists, adminControllers.deleteUser);
adminRouter.use(authRouter);

module.exports = { adminRouter }