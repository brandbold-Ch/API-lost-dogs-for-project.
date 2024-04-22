const {updateAuthSchema} = require("../../models/schemaValidator/authScheme");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");


const validateUpdateAuthData = async (req, res, next) => {
    try {
        await updateAuthSchema.validateAsync(req.body);
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

module.exports = {validateUpdateAuthData};