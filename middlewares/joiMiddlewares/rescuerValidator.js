const { rescuerCreationSchema } = require("../../schemas/rescuerSchema");
const { HandlerHttpVerbs } = require("../../errors/handlerHttpVerbs");
const { ValidationError } = require("joi");
const { authCreationSchema } = require("../../schemas/authSchema");
const { errorTypeSelector } = require("./errorTypeSelector");


const rescuerDataValidator = async (req, res, next) => {
    try {
        const { name , social_networks, description, email, password } = req.body;

        await rescuerCreationSchema.validateAsync({
            name: name,
            social_networks: (social_networks)? JSON.parse(social_networks) : undefined,
            description: description
        });

        if (req.method === "POST") {
            await authCreationSchema.validateAsync({
                email: email,
                password: password
            });
        }
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


module.exports = { rescuerDataValidator }
