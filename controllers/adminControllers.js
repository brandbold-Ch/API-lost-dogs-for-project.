const { admin } = require('../singlenton/uniqueInstances');

exports.setAdmin = async (req, res) => {
    try {
        await admin.create(req.body);
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
        res.status(200).json(await admin.getAdmin(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        await admin.updateAdmin(req.id, req.body);
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
        await admin.delAdmin(req.id);
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

exports.activateRequest = async (req, res) => {
    try {
        await admin.activateRequest(req.params.id)
        res.status(200).json({message: 'Activate request ✅'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deactivateRequest = async (req, res) => {
    try {
        await admin.deactivateRequest(req.params.id)
        res.status(200).json({message: 'Deactivate request ✅'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.rejectRequest = async (req, res) => {
    try {
        await admin.rejectRequest(req.params.id)
        res.status(200).json({message: 'Reject request ✅'});

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
