const {Authenticate} = require("../middlewares/authenticator");
const adminControllers = require("../controllers/adminControllers");
const authControllers = require("../controllers/authControllers");
const {validateQueryAction} = require("../middlewares/handlerInputData/handlerAnyData");
const {validateSetAdminData} = require("../middlewares/handlerInputData/handlerAdminData");
const {validateUpdateAuthData} = require("../middlewares/handlerInputData/handlerAuthData");
const express = require("express");
const adminRouter = express.Router();
const {
    checkEntityExists,
    checkRequestExists,
    checkQueryStatus,
    checkAccountExists,
    verifyUpdateAuth
} = require("../middlewares/generalMiddlewares");


adminRouter.post("/", express.urlencoded({extended: true}), validateSetAdminData, checkAccountExists, adminControllers.setAdmin);

adminRouter.use([
    Authenticate,
    checkEntityExists
]);

adminRouter.get("/", adminControllers.getAdmin);
adminRouter.delete("/", adminControllers.delAdmin);
adminRouter.put("/", express.urlencoded({extended: true}), adminControllers.updateAdmin);

adminRouter.get("/auth", authControllers.getAuth);
adminRouter.put("/auth", express.urlencoded({extended: true}), validateUpdateAuthData, verifyUpdateAuth, authControllers.updateAuth);

adminRouter.get("/requests", adminControllers.getRequests);
adminRouter.delete("/requests/:req_id", adminControllers.deleteRequest);
adminRouter.post("/requests/:req_id", checkRequestExists, validateQueryAction, adminControllers.actionRequest);
adminRouter.get("/requests/filter", checkQueryStatus, adminControllers.filterRequests);

adminRouter.get("/rescuers", adminControllers.getRescuers);
adminRouter.get("/rescuers/:rescuer_id", adminControllers.getRescuer);
adminRouter.delete("/rescuers/:rescuer_id", adminControllers.deleteRescuer);

adminRouter.get("/users", adminControllers.getUsers);
adminRouter.get("/users/:user_id", adminControllers.getUser);
adminRouter.delete("/users/:user_id", adminControllers.deleteUser);

module.exports = {adminRouter};
