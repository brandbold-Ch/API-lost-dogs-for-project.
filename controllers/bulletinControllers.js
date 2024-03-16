const { bulletins } = require("../singlenton/instances");

exports.setBulletin = async (req, res) => {
    try {
        await bulletins.createBulletin(req.id, [JSON.parse(JSON.stringify(req.body)), req.files[0]])
        res.status(201).json({
            message: "Added bullet ✅",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getBulletins = async (req, res) => {
    try {
        res.status(200).json(await bulletins.getBulletins(req.id));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getBulletin = async (req, res) => {
    try {
        res.status(200).json(await bulletins.getBulletin(req.id, req.params.bulletin_id));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateBulletin = async (req, res) => {
    try {
        await bulletins.updateBulletin(req.id,
            req.params.bulletin_id, [JSON.parse(JSON.stringify(req.body)), req.files[0]]);

        res.status(200).json({
            message: 'Updated bulletin ✅',
            data: JSON.parse(JSON.stringify(req.body))
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteBulletin = async (req, res) => {
    try {
        await bulletins.deleteBulletin(req.id, req.params.bulletin_id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
