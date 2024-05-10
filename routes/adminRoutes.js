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
    checkAccountExists,
    entityExists
} = require("../middlewares/anyMiddlewares");


adminRouter.post("/", express.urlencoded({extended: true}), validateSetAdminData, checkAccountExists, adminControllers.setAdmin);

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

module.exports = {adminRouter}