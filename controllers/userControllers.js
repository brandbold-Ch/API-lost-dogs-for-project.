/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating user services.
 */

const { user } = require("../utils/instances");
const { HandlerHttpVerbs } = require("../errors/handlerHttpVerbs");


exports.createUser = async (req, res) => {
    try {
        const response_body = await user.createUser(req.body);

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added user ✅",
                undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
};

exports.getUsers = async (req, res) => {
    try {
        res.status(200).json(await user.getUsers());

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}

exports.getUser = async (req, res) => {
    try {
        res.status(200).json(await user.getUser(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}

exports.getRequests = async (req, res) => {
    try {
        res.status(200).json(await user.getRequests(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await user.deleteUser(req.id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}

exports.updateUser = async (req, res) => {
    try {
        const response_body = await user.updateUser(req.id, req.body);

        res.status(202).json(
            HandlerHttpVerbs.accepted(
                "Updated user ✅",
                undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}

exports.deleteSocialMedia = async (req, res) => {
    try {
        await user.deleteSocialMedia(req.id, req.query.key, req.query.value);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}

exports.makeRescuer = async (req, res) => {
    try {
        const response_body = await user.changeRole(req.id, req.role, "RESCUER");

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Request sent successfully ✅",
                undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}

exports.makeAssociation = async (req, res) => {
    try {
        const response_body = await user.changeRole(req.id, req.role, "ASSOCIATION");

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Request sent successfully ✅",
                undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}
