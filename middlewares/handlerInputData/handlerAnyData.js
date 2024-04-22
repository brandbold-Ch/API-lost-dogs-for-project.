const {deleteImageScheme} = require("../../models/schemaValidator/anyScheme");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");


const validateQueryDeleteImage = async (req, res, next) => {
    try {
        await deleteImageScheme.validateAsync(req.query);
        next();

    } catch (err) {

        if (err instanceof ValidationError) {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    err.message, {url: req.baseUrl, verb: req.method}
                )
            );

        } else {
            res.status(500).json(
                HandlerHttpVerbs.internalServerError(
                    err.message, {url: req.baseUrl, verb: req.method}
                )
            );
        }
    }
}

module.exports = {validateQueryDeleteImage}
