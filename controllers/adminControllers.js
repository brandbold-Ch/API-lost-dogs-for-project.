const { admin } = require("../utils/instances");
const { HandlerHttpVerbs } = require("../errors/handlerHttpVerbs");


exports.createAdmin = async (req, res) => {
    try {
        const response_body = await admin.createAdmin(req.body);

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added admin ✅",
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
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
};

exports.getAdmin = async (req, res) => {
    try {
        res.status(200).json(await admin.getAdmin(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const response_body = await admin.updateAdmin(req.id, req.body);

        res.status(202).json(
            HandlerHttpVerbs.accepted(
                "Update admin ✅",
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
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
};

exports.delAdmin = async (req, res) => {
    try {
        await admin.deleteAdmin(req.id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getRequests = async (req, res) => {
    try {
        res.status(200).json(await admin.getRequests());

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.actionRequest = async (req, res) => {
    let response_body, message;

    try {
        switch (req.query.action) {

            case "activate":
                response_body = await admin.activateRequest(req.params.req_id);
                message = "Activated request ✅";
                break;

            case "disable":
                response_body = await admin.deactivateRequest(req.params.req_id);
                message = "Deactivated request ✅";
                break;

            case "reject":
                response_body = await admin.rejectRequest(req.params.req_id);
                message = "Rejected request ✅";
                break;
        }

        res.status(200).json(
            HandlerHttpVerbs.ok(
                message, undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.filterRequests = async (req, res) => {
    try {
        res.status(200).json(await admin.filterRequests(req.query.status));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteRequest = async (req, res) => {
    try {
        await admin.deleteRequest(req.params.req_id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getRescuers = async (req, res) => {
    try {
        res.status(200).json(await admin.getRescuers());

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getRescuer = async (req, res) => {
    try {
        res.status(200).json(await admin.getRescuer(req.params.rescuer_id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteRescuer = async (req, res) => {
    try {
        await admin.deleteRescuer(req.params.rescuer_id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getUsers = async (req, res) => {
    try {
        res.status(200).json(await admin.getUsers());

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getUser = async (req, res) => {
    try {
        res.status(200).json(await admin.getUser(req.params.user_id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await admin.deleteUser(req.params.user_id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}
