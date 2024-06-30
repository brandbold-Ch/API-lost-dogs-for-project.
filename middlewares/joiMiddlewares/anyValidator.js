const { deleteImageSchema, checkQueryStatus} = require("../../schemas/anySchema");
const { HandlerHttpVerbs } = require("../../errors/handlerHttpVerbs");
const { ValidationError } = require("joi");
const { errorTypeSelector } = require("./errorTypeSelector");


const validateQueryDeleteImage = async (req, res, next) => {
    try {
        await deleteImageSchema.validateAsync(req.query);
        next();

    } catch (err) {

        if (err instanceof ValidationError) {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    err.message,
                    errorTypeSelector(err),
                    { url: req.baseUrl, verb: req.method }
                )
            );

        } else {
            res.status(500).json(
                HandlerHttpVerbs.internalServerError(
                    err.message, { url: req.baseUrl, verb: req.method }
                )
            );
        }
    }
}

const validateQueryAction = async (req, res, next) => {
    try {
        await checkQueryStatus.validateAsync(req.query);
        next();

    } catch (err) {

        if (err instanceof ValidationError) {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    err.message,
                    errorTypeSelector(err),
                    { url: req.baseUrl, verb: req.method }
                )
            );

        } else {
            res.status(500).json(
                HandlerHttpVerbs.internalServerError(
                    err.message, { url: req.baseUrl, verb: req.method }
                )
            );
        }
    }
}

module.exports = {
    validateQueryDeleteImage,
    validateQueryAction
}
