const {setRescuerSchema} = require("../../models/schemaValidator/rescuerSchema");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");
const {setAuthSchema} = require("../../models/schemaValidator/authSchema");


const validateRescuerData = async (req, res, next) => {
    try {
        const {name, address, identifier, description, email, password} = req.body;

        await setRescuerSchema.validateAsync(
            {
                name: name,
                address: address,
                identifier: identifier,
                description: description
            },
            {abortEarly: false}
        );

        if (req.method === "POST") {
            await setAuthSchema.validateAsync(
                {
                    email: email,
                    password: password
                },
                {abortEarly: false}
            );
        }

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


module.exports = {validateRescuerData}
