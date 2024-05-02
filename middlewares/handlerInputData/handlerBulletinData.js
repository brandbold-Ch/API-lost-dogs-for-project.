const {setBulletinsSchema} = require("../../models/schemaValidator/bulletinSchema");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");


const validateBulletinData = async (req, res, next) => {
    try {
        await setBulletinsSchema.validateAsync(
            JSON.parse(JSON.stringify(req.body)),
            {abortEarly: false}
        );

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

module.exports = {validateBulletinData}