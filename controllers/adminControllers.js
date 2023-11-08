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
