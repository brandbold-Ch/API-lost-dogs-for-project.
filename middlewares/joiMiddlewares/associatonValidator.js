const { associationUpdateSchema } = require("../../schemas/associationSchema");
const { HandlerHttpVerbs } = require("../../errors/handlerHttpVerbs");
const { ValidationError } = require("joi");
const { errorTypeSelector } = require("./errorTypeSelector");


const associationDataValidator = async (req, res, next) => {
    try {
        const { name , social_networks, description } = req.body;

        await associationUpdateSchema.validateAsync({
            name: name,
            social_networks: (social_networks)? JSON.parse(social_networks) : undefined,
            description: description
        });
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


module.exports = { associationDataValidator }
