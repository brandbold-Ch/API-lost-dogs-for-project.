/**
 * @author Brandon Jared Molina Vazquez
 * @date 30/09/2023
 * @file This module is for user middleware.
 */

const {post, auth, admin, bulletin} = require('../utils/instances');
const {HandlerHttpVerbs} = require("../errors/handlerHttpVerbs");

/**
 * Middleware to check if a user with the specified ID exists.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */


const checkEntityExists = async (req, res, next) => {
    try {
        const entity = await auth.getAuthByUser(req.id || req.query.user);

        if (entity) {
            next();

        } else {
            res.status(404).json(
                HandlerHttpVerbs.notFound(
                    "Not found account 🚫",
                    {url: req.baseUrl, verb: req.method}
                )
            );
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const verifyUpdateAuth = async (req, res, next) => {
    try {
        const account = await auth.getAuthByEmail(req.body["email"]);

        if (account) {
            if ((account["user"].toString() === req.id) &&
                (account["email"] === req.body["email"])) {
                next();

            } else {
                res.status(400).json(
                    HandlerHttpVerbs.badRequest(
                        "Account already exists 🤪",
                        {url: req.baseUrl, verb: req.method}
                    )
                );
            }
        } else {
            next();
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const checkAccountExists = async (req, res, next) => {
    try {
        const account = await auth.getAuthByEmail(req.body["email"]);

        if (!account) {
            next();

        } else {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    "Account already exists 🤪",
                    {url: req.baseUrl, verb: req.method}
                )
            );
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const checkRequestExistsForUser = async (req, res, next) => {
    try {
        const request = await admin.getRequestByUser(req.id);

        if (request) {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    "Only one request can be made 🤪",
                    {url: req.baseUrl, verb: req.method}
                )
            );

        } else {
            next();
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const checkBulletinExists = async (req, res, next) => {
    try {
        const data = await bulletin.getBulletin(req.id, req.params.bulletin_id);

        if (data) {
            next();

        } else {
            res.status(404).json(
                HandlerHttpVerbs.notFound(
                    "Not found bulletin 🚫",
                    {url: req.baseUrl, verb: req.method}
                )
            );
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const checkPostExists = async (req, res, next) => {
    try {
        const entity = await post.getPost(req.id, req.params.pet_id);

        if (entity) {
            next();

        } else {
            res.status(404).json(
                HandlerHttpVerbs.notFound(
                    "Not found post 🚫",
                    {url: req.baseUrl, verb: req.method}
                )
            );
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const checkQueryParameters = async (req, res, next) => {
    try {
        const link = req.query.value;
        const value = req.path.split('/').pop();

        const choices = {
            size: ['Chico', 'Mediano', 'Grande'],
            gender: ['Hembra', 'Macho'],
            owner: ['true', 'false'],
            found: ['true', 'false'],
            id: [],
            breed: [],
            specie: ['Perro', 'Gato', 'Ave']
        }

        if (link && choices[value].includes(link) || choices[value].length === 0) {
            next();

        } else {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    `The parameters must be 👉 ${choices[value]} 👈`,
                    {url: req.baseUrl, verb: req.method}
                )
            );
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const userRolePermission = async (req, res, next) => {
    try {
        if (req.role.includes("USER")) {
            next();

        } else {
            res.status(401).json(
                HandlerHttpVerbs.unauthorized(
                    "You don´t have access to this route 🚫",
                    {url: req.baseUrl, verb: req.method, role: ["USER"]}
                )
            )
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const rescuerRolePermission = async (req, res, next) => {
    try {

        if (req.role.includes("RESCUER")) {
            const request = await admin.getRequestByUser(req.id);

            if (request["status"] === "pending") {
                res.status(403).json(
                    HandlerHttpVerbs.forbidden(
                        "You are in a waiting process, " +
                        "the administrator must activate your account ⏳",
                        {url: req.baseUrl, verb: req.method, role: req.role}
                    )
                );

            } else if (request["status"] === "rejected") {
                res.status(401).json(
                    HandlerHttpVerbs.unauthorized(
                        "Your request was rejected by the administrator 🚫",
                        {url: req.baseUrl, verb: req.method, role: req.role}
                    )
                );

            } else if (request["status"] === "active") {
                next();

            } else {
                res.status(403).json(
                    HandlerHttpVerbs.forbidden(
                        "Your account is deactivated 📴",
                        {url: req.baseUrl, verb: req.method, role: req.role}
                    )
                );
            }

        } else {
            res.status(401).json(
                HandlerHttpVerbs.unauthorized(
                    "You don´t have access to this route 🚫",
                    {url: req.baseUrl, verb: req.method, role: ["RESCUER"]}
                )
            );
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const checkRequestExists = async (req, res, next) => {
    try {
        const request = await admin.getRequestById(req.params.req_id);

        if (request) {
            next();

        } else {
            res.status(404).json(
                HandlerHttpVerbs.notFound(
                    "Not found request 🚫",
                    {url: req.baseUrl, verb: req.method}
                )
            );
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const checkQueryStatus = async (req, res, next) => {
    try {
        const choices = [
            'pending',
            'active',
            'disabled',
            'rejected'
        ];

        if (choices.includes(req.query.status)) {
            next();

        } else {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    `The parameters must be 👉 ${choices} 👈`,
                    {url: req.baseUrl, verb: req.method}
                )
            );
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

const seeRequest = async (req, res, next) => {
    try {
        const request = await admin.getRequestByUser(req.id);

        if (request) {
            next();

        } else {
            res.status(404).json(
                HandlerHttpVerbs.notFound(
                    "You have no request, you must make one if you want to be a rescuer. 🚫",
                    {url: req.baseUrl, verb: req.method}
                )
            );
        }


    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

module.exports = {
    checkPostExists,
    checkQueryParameters,
    rescuerRolePermission,
    userRolePermission,
    checkRequestExists,
    checkQueryStatus,
    checkBulletinExists,
    checkEntityExists,
    checkAccountExists,
    checkRequestExistsForUser,
    verifyUpdateAuth,
    seeRequest
}
