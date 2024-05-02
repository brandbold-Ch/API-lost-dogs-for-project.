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
        .max(10)
        .optional()
});

module.exports = {setBulletinsSchema}
