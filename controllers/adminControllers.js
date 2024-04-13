const {admin} = require("../utils/instances");


exports.setAdmin = async (req, res) => {
    try {
        const response_body = await admin.setAdmin(req.body);

        res.status(201).json({
            message: "Added admin ✅",
            status_code: 201,
            data: response_body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAdmin = async (req, res) => {
    try {
        res.status(200).json(await admin.getAdmin(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const response_body = await admin.updateAdmin(req.id, req.body);

        res.status(202).json({
            message: "Updated admin ✅",
            status_code: 202,
            data: response_body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.delAdmin = async (req, res) => {
    try {
        await admin.deleteAdmin(req.id);

        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getRequests = async (req, res) => {
    try {
        res.status(200).json(await admin.getRequests());

    } catch (error) {
        res.status(500).json({message: error.message});
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

            case "deactivate":
                response_body = await admin.deactivateRequest(req.params.req_id);
                message = "Deactivated request ✅";
                break;

            case "reject":
                response_body = await admin.rejectRequest(req.params.req_id);
                message = "Rejected request ✅";
                break;
        }

        res.status(200).json({
            message: message,
            status_code: 200,
            data: response_body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.filterRequests = async (req, res) => {
    try {
        res.status(200).json(await admin.filterRequests(req.query.status));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteRequest = async (req, res) => {
    try {
        await admin.deleteRequest(req.params.req_id);

        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getRescuers = async (req, res) => {
    try {
        res.status(200).json(await admin.getRescuers());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getRescuer = async (req, res) => {
    try {
        res.status(200).json(await admin.getRescuer(req.params.collab_id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteRescuer = async (req, res) => {
    try {
        await admin.deleteRescuer(req.params.collab_id);

        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getUsers = async (req, res) => {
    try {
        res.status(200).json(await admin.getUsers());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getUser = async (req, res) => {
    try {
        res.status(200).json(await admin.getUser(req.params.user_id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await admin.deleteUser(req.params.user_id);

        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
