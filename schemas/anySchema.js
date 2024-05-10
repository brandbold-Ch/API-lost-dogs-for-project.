const Joi = require("joi");


const deleteImageSchema = Joi.object({

    id: Joi.string()
        .max(20)
        .required(),

    tag: Joi.string()
        .valid("image", "images")
        .required()

}).options({
    abortEarly: true
});

const checkQueryStatus = Joi.object({
    action: Joi.string()
        .valid(
            "activate",
            "deactivate",
            "reject"
        )
        .required()

}).options({
    abortEarly: true
})

module.exports = {
    deleteImageSchema,
    checkQueryStatus
}
