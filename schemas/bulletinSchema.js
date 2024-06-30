const Joi = require("joi");


const bulletinCreationSchema = Joi.object({
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

}).options({
    allowUnknown: true,
    abortEarly: true
});

module.exports = { bulletinCreationSchema }
