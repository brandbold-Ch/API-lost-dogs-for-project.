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
