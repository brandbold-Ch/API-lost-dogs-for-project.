const { collabs } = require('../singlenton/uniqueInstances');

exports.setCollab = async (req, res) => {
    try {
        await collabs.create(req.body);
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