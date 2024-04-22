const {setUserSchema} = require("../../models/schemaValidator/userScheme");
const {setAuthSchema} = require("../../models/schemaValidator/authScheme");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");


const validateSetUserData = async (req, res, next) => {
    try {
        const {name, lastname, cellphone, social_networks, email, password} = req.body;

        await setUserSchema.validateAsync({
            name: name,
            lastname: lastname,
            cellphone: cellphone,
            social_networks: social_networks
        });

        await setAuthSchema.validateAsync({
            email: email,
            password: password
        });

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

module.exports = {
    validateSetUserData,
}