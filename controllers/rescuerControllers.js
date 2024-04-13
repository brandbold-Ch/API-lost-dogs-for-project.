const { rescuer } = require('../utils/instances');


exports.setRescuer = async (req, res) => {
    try {
        await rescuer.setRescuer(req.body);

        res.status(201).json({
            message: 'Added rescuer ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getRescuer = async (req, res) => {
    try {
        res.status(200).json(await rescuer.getRescuer(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteRescuer = async (req, res) => {
    try {
        await rescuer.deleteRescuer(req.id);

        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateRescuer = async (req, res) => {
    try {
        await rescuer.updateRescuer(req.id, req.body);

        res.status(202).json({
            message: 'Updated rescuer ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
