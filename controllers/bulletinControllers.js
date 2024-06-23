const {bulletin} = require("../utils/instances");
const {HandlerHttpVerbs} = require("../errors/handlerHttpVerbs");


exports.createBulletin = async (req, res) => {
    try {
        const response_body = await bulletin.createBulletin(
            req.id,
            [JSON.parse(JSON.stringify(req.body)), req.files],
            req.role
        );

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added bulletin ✅",
                undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getBulletins = async (req, res) => {
    try {
        res.status(200).json(await bulletin.getBulletins(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getBulletin = async (req, res) => {
    try {
        res.status(200).json(await bulletin.getBulletin(req.id, req.params.bulletin_id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.updateBulletin = async (req, res) => {
    try {
        const response_body = await bulletin.updateBulletin(
            req.id,
            req.params.bulletin_id,
            [JSON.parse(JSON.stringify(req.body)), req.files]
        );

        res.status(202).json(
            HandlerHttpVerbs.accepted(
                "Updated bulletin ✅",
                undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteImage = async (req, res) => {
    try {
        await bulletin.deleteImageGallery(req.id, req.params.bulletin_id, req.query);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteBulletin = async (req, res) => {
    try {
        await bulletin.deleteBulletin(req.id, req.params.bulletin_id, req.role);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}
