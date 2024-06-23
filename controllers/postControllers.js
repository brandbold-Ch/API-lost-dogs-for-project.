/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating pets services.
 */

const { post } = require("../utils/instances");
const { HandlerHttpVerbs } = require("../errors/handlerHttpVerbs");


exports.createPost = async (req, res) => {
    try {
        const response_body = await post.createPost(
            req.id,
            [
                JSON.parse(JSON.stringify(req.body)),
                req.files
            ],
            req.role
        );

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added post ✅", undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getPosts = async (req, res) => {
    try {
        res.status(200).json(await post.getPosts(req.id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.filterPosts = async (req, res) => {
    try {
        if (req.query?.gender) {
            res.status(200).json(await post.getFilterPostGender(req.id, req.query.gender));
        }

        else if (req.query?.breed) {
            res.status(200).json(await post.getFilterPostBreed(req.id, req.query.breed));
        }

        else if (req.query?.size) {
            res.status(200).json(await post.getFilterPostSize(req.id, req.query.size));
        }

        else if (req.query?.owner) {
            res.status(200).json(await post.getFilterPostOwner(req.id, req.query.owner));
        }

        else if (req.query?.found) {
            res.status(200).json(await post.getFilterPostFound(req.id, req.query.found));
        }

        else if (req.query?.specie) {
            res.status(200).json(await post.getFilterPostSpecie(req.id, req.query.specie));
        }

        else if (req.query?.date) {
            res.status(200).json(await post.getFilterPostLostDate(req.id, req.query.date));
        }

        else if (req.query?.year) {
            res.status(200).json(await post.getFilterPostYear(req.id, req.query.year));
        }

        else if (req.query?.lost_date) {
            res.status(200).json(await post.getFilterPostLostDate(req.id, req.query.lost_date));
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getPost = async (req, res) => {
    try {
        res.status(200).json(await post.getPost(req.id, req.params.pet_id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.updatePost = async (req, res) => {
    try {
        const response_body = await post.updatePost(
            req.id,
            req.params.pet_id,
            [
                JSON.parse(JSON.stringify(req.body)),
                req.files
            ]
        );

        res.status(202).json(
            HandlerHttpVerbs.accepted(
                "Updated post ✅",
                undefined, {
                    data: response_body,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deletePost = async (req, res) => {
    try {
        await post.deletePost(req.id, req.params.pet_id, req.role);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteImage = async (req, res) => {
    try {
        await post.deletePartialGallery(req.id, req.params.pet_id, req.query);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.insertComment = async (req, res) => {
    try {
        const comment = await post.insertComment(req.id, req.params.pet_id, req.body, req.role);

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added comment ✅",
                undefined, {
                    data: comment,
                    url: req.baseUrl,
                    verb: req.method
                }
            )
        );

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}
