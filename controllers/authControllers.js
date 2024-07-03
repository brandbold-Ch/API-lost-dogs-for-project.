/**
 * @author Brandon Jared Molina Vazquez
 * @date 04/10/2023
 * @file This module is for creating auth services.
 */

const {auth} = require('../utils/instances');
const {Request} = require("../models/rescuer");
const {HandlerHttpVerbs} = require("../errors/handlerHttpVerbs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {errorsCodes} = require("../utils/codes");


exports.getAuth = async (req, res) => {
    try {
        res.status(200).json(await auth.getAuthByUser(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.updateAuth = async (req, res) => {
    try {
        const response_body = await auth.updateAuth(req.id, req.body);

        res.status(202).json(
            HandlerHttpVerbs.accepted(
                "Updated credentials ✅",
                undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {

        if (err.message === "Incorrect") {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    "Passwords do not match 🔐",
                    undefined, {
                        url: req.baseUrl,
                        verb: req.method
                    }
                )
            );

        } else {
            res.status(500).json(
                HandlerHttpVerbs.internalServerError(
                    err.message, {url: req.baseUrl, verb: req.method}
                )
            );
        }
    }
}

const typeUser = (data) => {
    return new Promise(async (resolve, reject) => {
        if (data[1]["role"] === "RESCUER") {
            const request = await Request.findOne({ user_id: data[1]["user_id"] });

            switch (request["status"]) {
                case "pending":
                    reject([403, "You are in a waiting process, " +
                    "the administrator must activate your account ⏳"
                    ]);
                    break;

                case "rejected":
                    reject([401, "Your request was rejected by the administrator 🚫"]);
                    break;

                case "disabled":
                    reject([403, "Your account is deactivated 📴"]);
                    break;
            }
        }
        resolve(data);
    })
}

const validateRequest = (body) => {
    return new Promise((resolve, reject) => {

        if (body.email && body.password) {
            resolve(body);

        } else {
            reject([400, "You did not send your credentials correctly 🙅‍♂️"]);
        }
    });
}

const validateEmail = (body) => {
    return new Promise((resolve, reject) => {
        const parseEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(body.email);

        if (parseEmail) {
            resolve(body);

        } else {
            reject([400, "Invalid email field 🤦‍♂️"]);
        }
    })
}

const validateUser = (body) => {
    return new Promise(async (resolve, reject) => {
        const entity = await auth.getAuthByEmail(body.email);

        if (entity) {
            resolve([body, entity]);

        } else {
            reject([404, "Not found account 👻", errorsCodes.DB_NOT_FOUND]);
        }
    });
}

const validatePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        const match = bcrypt.compareSync(data[0].password, data[1].password);

        if (match) {

            const token = jwt.sign(
                {user_id: data[1]["user_id"], role: data[1]["role"]},
                process.env.SECRET_KEY,
                {expiresIn: process.env.EXPIRE}
            );
            const decompile = jwt.decode(token, process.env.SECRET_KEY);

            resolve({
                token: token,
                role: data[1]["role"],
                details: {
                    start: decompile["iat"],
                    end: decompile["exp"]
                }
            });

        } else {
            reject([401, "Incorrect password 🤦‍♂️"]);
        }
    })
}

exports.login = async (req, res) => {
    validateRequest(req.body)
        .then(body => validateEmail(body))
        .then(email => validateUser(email))
        .then(burden => typeUser(burden))
        .then(async data => {
            res.status(200).json(await validatePassword(data));
        })
        .catch(err => {

            if (err instanceof Array) {
                let errorMsg;

                if (err.length === 3) {
                    errorMsg = err[2];
                }

                res.status(err[0]).json(
                    HandlerHttpVerbs.automaticSelectionError(
                        err[1], { url: req.baseUrl, verb: req.method },
                        errorMsg, err[0]
                    )
                );

            } else {
                res.status(500).json(
                    HandlerHttpVerbs.internalServerError(
                        err.message, { url: req.baseUrl, verb: req.method }
                    )
                );
            }
        })
}

exports.statusToken = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (token) {
            res.status(200).json(await auth.detailToken(token));

        } else {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    "You didn't send the token 🙄",
                    undefined, {
                        url: req.baseUrl,
                        verb: req.method
                    }
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

exports.refreshToken = async (req, res) => {
    try {
        const token = await auth.refreshToken(req.headers.authorization);

        if (token.length) {
            if (token[1] instanceof Object) {
                res.status(token[0]).json(token[1]);

            } else {
                res.status(token[0]).json(
                    HandlerHttpVerbs.ok(
                        token[1], undefined, {
                            url: req.baseUrl,
                            verb: req.method
                        }
                    )
                );
            }

        } else {
            res.status(201).json(
                HandlerHttpVerbs.unauthorized(
                    "You need to have had a session previously ✅",
                    undefined, {
                        url: req.baseUrl,
                        verb: req.method
                    }
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
