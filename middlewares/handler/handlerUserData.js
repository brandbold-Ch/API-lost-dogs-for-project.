const {setUserSchema} = require("../../schemas/userSchema");
const {setAuthSchema} = require("../../schemas/authSchema");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");
const {patternSelector} = require("./patternSelector");


const validateUserData = async (req, res, next) => {
    try {
        const {name, lastname, phone_number, social_networks, email, password} = req.body;

        await setUserSchema.validateAsync({
            name: name,
            lastname: lastname,
            phone_number: phone_number,
            social_networks: social_networks
        });

        if (req.method === "POST") {
            await setAuthSchema.validateAsync({
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

module.exports = {validateUserData}
