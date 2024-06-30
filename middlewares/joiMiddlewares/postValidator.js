const { postCreationSchema} = require("../../schemas/postSchema");
const { HandlerHttpVerbs } = require("../../errors/handlerHttpVerbs");
const { ValidationError } = require("joi");
const { errorTypeSelector } = require("./errorTypeSelector");


const postDataValidator = async (req, res, next) => {
    try {
        await postCreationSchema.validateAsync(
            JSON.parse(JSON.stringify(req.body))
        );
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

module.exports = { postDataValidator }
