const Joi = require("joi");


const setBulletinsSchema = Joi.object({
    title: Joi.string()
        .required(),

    text: Joi.string()
        .required(),

    name_company: Joi.string()
        .required(),

    address: Joi.string()
        .optional(),

    te_number: Joi.string()
        .regex(new RegExp(/^\d{10}$/))
        .max(10)
        .min(10)
        .optional()
        .messages({
            "string.pattern.base": "Invalid number. Must be a numeric string"
        })
}).options({allowUnknown: true});

module.exports = {setBulletinsSchema}
