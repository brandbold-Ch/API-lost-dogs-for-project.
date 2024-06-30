const { association } = require('../utils/instances');
const { HandlerHttpVerbs } = require("../errors/handlerHttpVerbs");


exports.createRescuer = async (req, res) => {
    try {
        const response_body = await association.createAssociation([
            JSON.parse(JSON.stringify(req.body)),
            req.files
        ]);

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added association ✅",
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
                err.message, { url: req.baseUrl, verb: req.method }
            )
        );
    }
}

exports.getRescuer = async (req, res) => {
    try {
        res.status(200).json(await association.getAssociation(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteRescuer = async (req, res) => {
    try {
        await association.deleteAssociation(req.id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.updateRescuer = async (req, res) => {
    try {
        const response_body = await association.updateAssociation(
            req.id,
            [
                JSON.parse(JSON.stringify(req.body)),
                req.files
            ]
        );

        res.status(202).json(
            HandlerHttpVerbs.accepted(
                "Updated association ✅",
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

exports.deleteSocialMedia = async (req, res) => {
    try {
        await association.deleteSocialMedia(req.id, req.query.key, req.query.value);
        res.status(204).end();

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
        await association.deleteImage(req.id, req.params.image_id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}
