const {setAdminSchema} = require("../../schemas/adminSchema");
const {setAuthSchema} = require("../../schemas/authSchema");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");
const {patternSelector} = require("./patternSelector");


const validateSetAdminData = async (req, res, next) => {
    try {
        const {name, lastname, token, email, password} = req.body;

        await setAdminSchema.validateAsync({
            name: name,
            lastname: lastname,
            token: token
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

module.exports = {validateSetAdminData}