const Joi = require("joi");


const setRescuerSchema = Joi.object({
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
    abortEarly: true
});

module.exports = {setRescuerSchema}
