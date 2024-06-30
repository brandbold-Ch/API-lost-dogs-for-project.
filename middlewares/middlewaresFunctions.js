/**
 * @author Brandon Jared Molina Vazquez
 * @date 30/09/2023
 * @file This module contains various middleware functions for user operations.
 */

const { post, auth, admin, bulletin, blog } = require('../utils/instances');
const { HandlerHttpVerbs } = require("../errors/handlerHttpVerbs");
const { errorsCodes } = require("../utils/codes");


const handleNotFoundResponse = (entityData, req, res, entityName, next) => {
    if (!entityData) {
        return res.status(404).json(
            HandlerHttpVerbs.notFound(
                `Not found ${entityName} 🚫`,
                errorsCodes.DB_NOT_FOUND,
                { url: req.baseUrl, verb: req.method }
            )
        );
    }
    next();
};


const checkBlogExists = async (req, res, next) => {
    try {
        await handleNotFoundResponse(
            await blog.getBlog(req.id, req.params.blog_id),
            req, res, "blog", next
        );
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkEntityExists = async (req, res, next) => {
    try {
        await handleNotFoundResponse(
            await auth.getAuthByUser(req.id || req.query.user || req.params.rescuer_id),
            req, res, "user", next
        );
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const entityExists = async (req, res, next) => {
    try {
        const entity = await auth.getAuthByUser(req.params.rescuer_id || req.params.user_id);
        const route = req.path.split("/");

        if (route.includes("users")) {
            if (entity?.role === "USER") {
                next();
            } else {
                res.status(404).json(
                    HandlerHttpVerbs.notFound(
                        "Not found user 🚫",
                        errorsCodes.DB_NOT_FOUND,
                        { url: req.baseUrl, verb: req.method }
                    )
                );
            }
        } else if (route.includes("rescuers")) {
            if (entity?.role === "RESCUER") {
                next();
            } else {
                res.status(404).json(
                    HandlerHttpVerbs.notFound(
                        "Not found rescuer 🚫",
                        errorsCodes.DB_NOT_FOUND,
                        { url: req.baseUrl, verb: req.method }
                    )
                );
            }
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const verifyUpdateAuth = async (req, res, next) => {
    try {
        const account = await auth.getAuthByEmail(req.body["email"]);

        if (account) {
            if ((account["user_id"].toString() === req.id) &&
                (account["email"] === req.body["email"])) {
                next();
            } else {
                res.status(400).json(
                    HandlerHttpVerbs.badRequest(
                        "Account already exists 🤪",
                        errorsCodes.DB_DUPLICATED_KEY,
                        { url: req.baseUrl, verb: req.method }
                    )
                );
            }
        } else {
            next();
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkAccountExists = async (req, res, next) => {
    try {
        const account = await auth.getAuthByEmail(req.body["email"]);

        if (!account) {
            next();
        } else {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    "Account already exists 🤪",
                    errorsCodes.DB_DUPLICATED_KEY,
                    { url: req.baseUrl, verb: req.method }
                )
            );
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkRequestExistsForUser = async (req, res, next) => {
    try {
        const request = await admin.getRequestByUser(req.id);

        if (request) {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    "Only one request can be made 🤪",
                    errorsCodes.DB_DUPLICATED_KEY,
                    { url: req.baseUrl, verb: req.method }
                )
            );
        } else {
            next();
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkBulletinExists = async (req, res, next) => {
    try {
        await handleNotFoundResponse(
            await bulletin.getBulletin(req.id, req.params.bulletin_id),
            req, res, "bulletin", next
        );
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkBulletinExistsForGuest = async (req, res, next) => {
    try {
        await handleNotFoundResponse(
            await bulletin.getBulletinForGuest(req.query.ad),
            req, res, "bulletin", next
        );
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkBlogExistsForGuest = async (req, res, next) => {
    try {
        await handleNotFoundResponse(
            await blog.getBlogForGuest(req.query.ad),
            req, res, "blog", next
        );
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkPostExists = async (req, res, next) => {
    try {
        await handleNotFoundResponse(
            await post.getPost(req.id, req.params.pet_id),
            req, res, "post", next
        );
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkPostExistsForGuest = async (req, res, next) => {
    try {
        await handleNotFoundResponse(
            await post.getPostForGuest(req.query.pet),
            req, res, "post", next
        );
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkQueryParameters = async (req, res, next) => {
    try {
        const keys = Object.keys(req.query);
        const values = Object.values(req.query);

        const choices = {
            size: ['Chico', 'Mediano', 'Grande'],
            gender: ['Hembra', 'Macho'],
            owner: ['true', 'false'],
            found: ['true', 'false'],
            id: [],
            breed: [],
            specie: ['Perro', 'Gato', 'Ave']
        };

        if (keys.length) {
            if (choices[keys[0]]?.includes(values[0]) || choices[keys[0]]?.length === 0) {
                next();
            } else {
                res.status(400).json(
                    HandlerHttpVerbs.badRequest(
                        `The parameters must be 👉 ${choices[keys[0]]} 👈`,
                        undefined, { url: req.baseUrl, verb: req.method }
                    )
                );
            }
        } else {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    `You did not define any filter. The parameters must be 👉 ${choices[values]} 👈`,
                    undefined, { url: req.baseUrl, verb: req.method }
                )
            );
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const userRolePermission = async (req, res, next) => {
    try {
        if (req.role === "USER") {
            next();
        } else {
            res.status(401).json(
                HandlerHttpVerbs.unauthorized(
                    "You don´t have access to this route 🚫",
                    undefined,
                    { url: req.baseUrl, verb: req.method, role: "USER" }
                )
            );
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const specialPermissions = async (req, res, next) => {
    try {
        if (req.role === "RESCUER" || req.role === "ASSOCIATION") {
            const request = await admin.getRequestByUser(req.id);

            switch (request["status"]) {
                case "pending":
                    res.status(403).json(
                        HandlerHttpVerbs.forbidden(
                            "You are in a waiting process, " +
                            "the administrator must activate your account ⏳",
                            undefined,
                            { url: req.baseUrl, verb: req.method, role: req.role }
                        )
                    );
                    break;

                case "rejected":
                    res.status(401).json(
                        HandlerHttpVerbs.unauthorized(
                            "Your request was rejected by the administrator 🚫",
                            undefined,
                            { url: req.baseUrl, verb: req.method, role: req.role }
                        )
                    );
                    break;

                case "active":
                    next();
                    break;

                default:
                    res.status(403).json(
                        HandlerHttpVerbs.forbidden(
                            "Your account is deactivated 📴",
                            undefined,
                            { url: req.baseUrl, verb: req.method, role: req.role }
                        )
                    );
            }
        } else {
            res.status(401).json(
                HandlerHttpVerbs.unauthorized(
                    "You don´t have access to this route 🚫",
                    undefined,
                    { url: req.baseUrl, verb: req.method, role: "RESCUER" }
                )
            );
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkRequestExists = async (req, res, next) => {
    try {
        await handleNotFoundResponse(
            await admin.getRequestById(req.params.req_id),
            req, res, "request", next
        );
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const checkQueryStatus = async (req, res, next) => {
    try {
        const choices = ['pending', 'active', 'disabled', 'rejected'];

        if (choices.includes(req.query.status)) {
            next();
        } else {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    `The parameters must be 👉 ${choices} 👈`,
                    undefined,
                    { url: req.baseUrl, verb: req.method }
                )
            );
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};


const showRequest = async (req, res, next) => {
    try {
        const request = await admin.getRequestByUser(req.id);

        if (request) {
            next();
        } else {
            res.status(404).json(
                HandlerHttpVerbs.notFound(
                    "You have no request, you must make one if you want to be a rescuer or association. 🚫",
                    undefined, { url: req.baseUrl, verb: req.method }
                )
            );
        }
    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};

module.exports = {
    checkPostExists,
    checkQueryParameters,
    checkRequestExistsForUser,
    checkPostExistsForGuest,
    specialPermissions,
    userRolePermission,
    checkRequestExists,
    checkQueryStatus,
    checkBulletinExists,
    checkBulletinExistsForGuest,
    checkBlogExistsForGuest,
    checkEntityExists,
    checkAccountExists,
    verifyUpdateAuth,
    showRequest,
    entityExists,
    checkBlogExists,
}
