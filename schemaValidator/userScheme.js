const Joi = require("joi");


const setUserSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required(),

    lastname: Joi.string()
        .max(50)
        .required(),

    cellphone: Joi.string()
        .optional()
        .max(10),

    social_networks: Joi.object()
        .pattern(
            Joi.string()
                .pattern(new RegExp("^[a-zA-Z0-9_]+$")).required(),

            Joi.string()
                .required()
        )
        .required()
});

module.exports = {setUserSchema};
