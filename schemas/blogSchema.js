const Joi = require("joi");


const setBlogSchema = Joi.object({

    markdown_text: Joi.string()
        .required()

}).options({
    allowUnknown: true,
    abortEarly: true
})

module.exports = {setBlogSchema}
