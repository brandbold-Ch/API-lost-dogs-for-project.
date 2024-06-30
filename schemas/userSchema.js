const Joi = require("joi");


const userCreationSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required(),

    lastname: Joi.string()
        .max(50)
        .required(),

    phone_number: Joi.string()
        .regex(new RegExp(/^\d{10}$/))
        .max(10)
        .min(10)
        .optional(),

    social_networks: Joi.object()
        .pattern(
            Joi.string()
                .pattern(new RegExp("^[a-zA-Z0-9_]+$"))
                .required(),

            Joi.string()
                .required()
        )
        .optional()

}).options({
    abortEarly: true
});

module.exports = { userCreationSchema }
