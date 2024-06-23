const Joi = require("joi");


const blogCreationSchema = Joi.object({

    markdown_text: Joi.string()
        .required()

}).options({
    allowUnknown: true,
    abortEarly: true
})

module.exports = { blogCreationSchema }
