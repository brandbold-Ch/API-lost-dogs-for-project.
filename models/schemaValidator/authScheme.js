const Joi = require("joi");

const supportedDomains = [
    "com",
    "net",
    "mx",
    "org"
]

const setAuthSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: {
                allow: supportedDomains
            }
        })
        .required(),

    password: Joi.string()
        .required()
});

const updateAuthSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: {
                allow: supportedDomains
            }
        })
        .required(),

    new_password: Joi.string()
        .required(),

    old_password: Joi.string()
        .required()
})

module.exports = {
    setAuthSchema,
    updateAuthSchema
};
