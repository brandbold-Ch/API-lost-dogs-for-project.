const {setAdminSchema} = require("../../models/schemaValidator/adminSchema");
const {setAuthSchema} = require("../../models/schemaValidator/authSchema");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");


const validateSetAdminData = async (req, res, next) => {
    try {
        const {name, lastname, token, email, password} = req.body;

        await setAdminSchema.validateAsync(
            {
                name: name,
                lastname: lastname,
                token: token
            },
            {abortEarly: false}
        );

        await setAuthSchema.validateAsync(
            {
                email: email,
                password: password
            },
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

module.exports = {validateSetAdminData}