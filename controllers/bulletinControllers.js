const {bulletin} = require("../utils/instances");


exports.setBulletin = async (req, res) => {
    try {
        const response_body = await bulletin.setBulletin(
            req.id,
            [
                JSON.parse(JSON.stringify(req.body)),
                req.files
            ],
            req.role
        );

        res.status(201).json({
            status: "Success",
            message: "Added bulletin ✅",
            status_code: 201,
            data: response_body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getBulletins = async (req, res) => {
    try {
        res.status(200).json(await bulletin.getBulletins(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getBulletin = async (req, res) => {
    try {
        res.status(200).json(await bulletin.getBulletin(req.id, req.params.bulletin_id));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateBulletin = async (req, res) => {
    try {
        await bulletin.updateBulletin(req.id,
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
            await bulletin.deletePartialGallery(req.id, req.params.bulletin_id, req.query.image);
            res.status(204).end();
        } else {
            res.status(404).json({message: "Id image required. ⚠️"});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteBulletin = async (req, res) => {
    try {
        await bulletin.deleteBulletin(req.id, req.params.bulletin_id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
