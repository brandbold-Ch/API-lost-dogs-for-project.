const { bulletins, posts} = require("../singlenton/instances");

exports.setBulletin = async (req, res) => {
    try {
        await bulletins.createBulletin(req.id, [JSON.parse(JSON.stringify(req.body)), req.files])
        res.status(201).json({
            message: "Added bulletin ✅",
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
            req.params.bulletin_id, [JSON.parse(JSON.stringify(req.body)), req.files]);

        res.status(202).json({
            message: 'Updated bulletin ✅',
            data: JSON.parse(JSON.stringify(req.body))
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.delPartialGallery = async (req, res) => {
    try {

        if (req.query.image) {
            await bulletins.deletePartialGallery(req.id, req.params.bulletin_id, req.query.image);
            res.status(204).end();
        }
        else {
            res.status(404).json({message: "Id image required. ⚠️"});
        }

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
