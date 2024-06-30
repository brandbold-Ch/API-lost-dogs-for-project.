const { adminCreationSchema } = require("../../schemas/adminSchema");
const { authCreationSchema } = require("../../schemas/authSchema");
const { HandlerHttpVerbs } = require("../../errors/handlerHttpVerbs");
const { ValidationError } = require("joi");
const { errorTypeSelector } = require("./errorTypeSelector");


const adminDataValidator = async (req, res, next) => {
    try {
        const { name, lastname, token, email, password } = req.body;

        await adminCreationSchema.validateAsync({
            name: name,
            lastname: lastname,
            token: token
        });

        await authCreationSchema.validateAsync({
            email: email,
            password: password
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

module.exports = { adminDataValidator }
