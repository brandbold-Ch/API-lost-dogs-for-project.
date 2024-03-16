const { admins } = require('../singlenton/instances');

exports.setAdmin = async (req, res) => {
    try {
        await admins.createAdmin(req.body);
        res.status(201).json({
            message: 'Added admin ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAdmin = async (req, res) => {
    try {
        res.status(200).json(await admins.getAdmin(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        await admins.updateAdmin(req.id, req.body);
        res.status(202).json({
            message: 'Updated admin ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.delAdmin = async (req, res) => {
    try {
        await admins.deleteAdmin(req.id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getRequests = async (req, res) => {
    try {
        res.status(200).json(await admins.getRequests());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.actionRequest = async (req, res) => {
    try {

        switch (req.query.action) {

            case "activate":
                await admins.activateRequest(req.params.id);
                res.status(200).json({message: 'Activate request ✅'});
                break;

            case "deactivate":
                await admins.deactivateRequest(req.params.id);
                res.status(200).json({message: 'Deactivate request ✅'});
                break;

            case "reject":
                await admins.rejectRequest(req.params.id)
                res.status(200).json({message: 'Reject request ✅'});
                break;
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.filterRequests = async (req, res) => {
    try {
        res.status(200).json(await admins.filterRequests(req.query.status));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteRequest = async (req, res) => {
    try {
        await admins.deleteRequest(req.params.id)
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getCollabs = async (req, res) => {
    try {
        res.status(200).json(await admins.getCollabs());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getCollab = async (req, res) => {
    try {
        res.status(200).json(await admins.getCollab(req.params.collab_id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteCollab = async (req, res) => {
    try {
        await admins.deleteCollab(req.params.collab_id)
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getUsers = async (req, res) => {
    try {
        res.status(200).json(await admins.getUsers());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getUser = async (req, res) => {
    try {
        res.status(200).json(await admins.getUser(req.params.user_id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await admins.deleteUser(req.params.user_id)
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
