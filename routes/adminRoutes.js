const {checkTrust} = require("../middlewares/entityManager");
const {checkUserExists, checkRequestExists} = require("../middlewares/entityManager");
const {checkQueryStatus, checkQueryAction} = require("../middlewares/entityManager");
const isAuthenticate = require("../middlewares/authenticator");
const adminControllers = require("../controllers/adminControllers");
const authControllers = require("../controllers/authControllers");
const express = require("express");
const adminRouter = express.Router();


adminRouter.post("/", express.urlencoded({extended: true}), checkTrust, adminControllers.setAdmin);

adminRouter.use([
    isAuthenticate,
    checkUserExists
]);

adminRouter.get("/", adminControllers.getAdmin);
adminRouter.delete("/", adminControllers.delAdmin);
adminRouter.put("/", express.urlencoded({extended: true}), adminControllers.updateAdmin);

adminRouter.get("/auth", authControllers.getAuth);
adminRouter.put("/auth", express.urlencoded({extended: true}), authControllers.updateAuth);

adminRouter.get("/requests", adminControllers.getRequests);
adminRouter.delete("/requests/:req_id", adminControllers.deleteRequest);
adminRouter.post("/requests/:req_id", checkRequestExists, checkQueryAction, adminControllers.actionRequest);
adminRouter.get("/requests/filter", checkQueryStatus, adminControllers.filterRequests);

adminRouter.get("/rescuers", adminControllers.getRescuers);
adminRouter.get("/rescuers/:rescuer_id", adminControllers.getRescuer);
adminRouter.delete("/rescuers/:rescuer_id", adminControllers.deleteRescuer);

adminRouter.get("/users", adminControllers.getUsers);
adminRouter.get("/users/:user_id", adminControllers.getUser);
adminRouter.delete("/users/:user_id", adminControllers.deleteUser);

module.exports = {adminRouter};
