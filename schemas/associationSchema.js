const Joi = require("joi");


const associationUpdateSchema = Joi.object({
    name: Joi.string()
        .required(),

    social_networks: Joi.object()
        .pattern(
            Joi.string()
                .pattern(new RegExp("^[a-zA-Z0-9_]+$"))
                .required(),

            Joi.string()
                .required()
        )
        .optional(),

    description: Joi.string()
        .required()

}).options({
    abortEarly: true,
    allowUnknown: true
});

module.exports = { associationUpdateSchema }
