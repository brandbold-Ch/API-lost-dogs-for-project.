const { authUpdateSchema } = require("../../schemas/authSchema");
const { HandlerHttpVerbs } = require("../../errors/handlerHttpVerbs");
const { ValidationError } = require("joi");
const { errorTypeSelector } = require("./errorTypeSelector");


const validatorUpdateAuth = async (req, res, next) => {
    try {
        await authUpdateSchema.validateAsync(req.body);
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

module.exports = { validatorUpdateAuth };