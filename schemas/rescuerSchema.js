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

}).options({
    abortEarly: true
});

module.exports = {setRescuerSchema}
