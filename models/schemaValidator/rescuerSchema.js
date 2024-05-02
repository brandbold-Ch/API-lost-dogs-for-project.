const Joi = require("joi");


const setRescuerSchema = Joi.object({
    name: Joi.string()
        .required(),

    address: Joi.string()
        .required(),

    identifier: Joi.string()
        .optional(),

    description: Joi.string()
        .required()
});

module.exports = {setRescuerSchema}
