const { association } = require('../utils/instances');
const { HandlerHttpVerbs } = require("../errors/handlerHttpVerbs");


exports.createAssociation = async (req, res) => {
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

exports.getAssociation = async (req, res) => {
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

exports.deleteAssociation = async (req, res) => {
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

exports.updateAssociation = async (req, res) => {
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

exports.addResCollab = async (req, res) => {
    try {
        const response_body = await association.addResCollab(req.id, req.params.rescuer_id);
        console.log(response_body)

        res.status(201).json(
            HandlerHttpVerbs.accepted(
                "Added rescuer ✅",
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

exports.getRescuers = async (req, res) => {
    try {
        res.status(200).json(await association.getRescuers(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}