const Joi = require("joi");


const deleteImageScheme = Joi.object({

    id: Joi.string()
        .max(20)
        .required(),

    tag: Joi.string()
        .valid("image", "images")
        .required()
});

module.exports = {deleteImageScheme}