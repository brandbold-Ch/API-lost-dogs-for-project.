const { bulletinCreationSchema } = require("../../schemas/bulletinSchema");
const { HandlerHttpVerbs } = require("../../errors/handlerHttpVerbs");
const { ValidationError } = require("joi");
const { patternSelector } = require("./patternSelector");


const validateBulletinData = async (req, res, next) => {
    try {
        await bulletinCreationSchema.validateAsync(
            JSON.parse(JSON.stringify(req.body))
        );
        next();

    } catch (err) {

        if (err instanceof ValidationError) {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    err.message,
                    patternSelector(err),
                    {url: req.baseUrl, verb: req.method}
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

module.exports = { validateBulletinData }