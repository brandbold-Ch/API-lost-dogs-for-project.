const { collabs } = require('../singlenton/instances');

exports.setCollab = async (req, res) => {
    try {
        await collabs.createCollab(req.body);
        res.status(201).json({
            message: 'Added collaborator ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getCollab = async (req, res) => {
    try {
        res.status(200).json(await collabs.getCollab(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteCollab = async (req, res) => {
    try {
        await collabs.deleteCollab(req.id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateCollab = async (req, res) => {
    try {
        await collabs.updateCollab(req.id, req.body);
        res.status(200).json({
            message: 'Updated collaborator ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
