const Joi = require("joi");


const postCreationSchema = Joi.object({
    name: Joi.string()
        .optional(),

    specie: Joi.string()
        .required(),

    gender: Joi.string()
        .valid("Macho", "Hembra"),

    age: Joi.string()
        .optional(),

    description: Joi.string()
        .required(),

    size: Joi.string()
        .valid(
            "Chico",
            "Mediano",
            "Grande",
            "No aplica"
        )
        .optional(),

    breed: Joi.string()
        .optional(),

    lost_date: Joi.date()
        .required(),

    location: Joi.object()
        .optional(),

    last_seen: Joi.string()
        .optional(),

    owner: Joi.bool()
        .optional()

}).options({
    allowUnknown: true,
    abortEarly: true
});

module.exports = { postCreationSchema }
