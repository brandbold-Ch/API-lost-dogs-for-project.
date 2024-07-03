const { postCreationSchema} = require("../../schemas/postSchema");
const { HandlerHttpVerbs } = require("../../errors/handlerHttpVerbs");
const { ValidationError } = require("joi");
const { errorTypeSelector } = require("./errorTypeSelector");


const postDataValidator = async (req, res, next) => {

    try {
        const {
            name,
            specie,
            gender,
            age,
            description,
            size,
            breed,
            lost_date,
            location,
            last_seen,
            owner
        } = JSON.parse(JSON.stringify(req.body));

        await postCreationSchema.validateAsync({
            name: name,
            specie: specie,
            gender: gender,
            age: age,
            description: description,
            size: size,
            breed: breed,
            lost_date: lost_date,
            location: (location)? JSON.parse(location) : undefined,
            last_seen: last_seen,
            owner: owner
        });
        next();

    } catch (err) {

        if (err instanceof ValidationError) {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    err.message,
                    errorTypeSelector(err),
                    { url: req.baseUrl, verb: req.method }
                )
            );

        } else {
            res.status(500).json(
                HandlerHttpVerbs.internalServerError(
                    err.message, { url: req.baseUrl, verb: req.method }
                )
            );
        }
    }
}

module.exports = { postDataValidator }
