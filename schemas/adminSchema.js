const Joi = require("joi");
require("dotenv").config();


const adminCreationSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required(),

    lastname: Joi.string()
        .max(50)
        .required(),

    token: Joi.string()
        .valid(process.env.TRUSTED_PERMISSIONS)
        .required()
        .messages({
            "any.only": "Invalid access token"
        })

}).options({
    abortEarly: true
});

module.exports = { adminCreationSchema }
