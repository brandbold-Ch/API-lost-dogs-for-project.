/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating pets services.
 */

const {post} = require("../utils/instances");
const {HandlerHttpVerbs} = require("../errors/handlerHttpVerbs");


exports.setPost = async (req, res) => {
    try {
        const response_body = await post.setPost(
            req.id,
            [
                JSON.parse(JSON.stringify(req.body)),
                req.files
            ],
            req.role
        );

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added post ✅", {
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
};

exports.getPosts = async (req, res) => {
    try {
        res.status(200).json(await post.getPosts(req.id));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getFilterPostGender = async (req, res) => {
    try {
        res.status(200).json(await post.getFilterPostGender(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getFilterPostBreed = async (req, res) => {
    try {
        res.status(200).json(await post.getFilterPostBreed(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getFilterPostSize = async (req, res) => {
    try {
        res.status(200).json(await post.getFilterPostSize(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getFilterPostOwner = async (req, res) => {
    try {
        res.status(200).json(await post.getFilterPostOwner(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getFilterPostFound = async (req, res) => {
    try {
        res.status(200).json(await post.getFilterPostFound(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getFilterPostSpecie = async (req, res) => {
    try {
        res.status(200).json(await post.getFilterPostSpecie(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getFilterPostLostDate = async (req, res) => {
    try {
        res.status(200).json(await post.getFilterPostLostDate(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getFilterPostYear = async (req, res) => {
    try {
        res.status(200).json(await post.getFilterPostYear(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.getPost = async (req, res) => {
    try {
        res.status(200).json(await post.getPost(req.id, req.params.pet_id));

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const response_body = await post.updatePost(
            req.id,
            req.params.pet_id,
            [
                JSON.parse(JSON.stringify(req.body)),
                req.files[0]
            ]
        );

        res.status(202).json({
            status: "Success",
            message: "Updated post ✅",
            status_code: 202,
            data: response_body
        });

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await post.deletePost(req.id, req.params.pet_id, req.role);

        res.status(204).end();

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.addGallery = async (req, res) => {
    try {
        await post.addGallery(req.id, req.params.pet_id, req.files);

        res.status(201).json({
            status: "Success",
            message: "Added images ✅",
            status_code: 201,
            data: `${req.files.length} buffered images`
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};

exports.delPartialGallery = async (req, res) => {
    try {
        if (req.query.image) {
            await post.deletePartialGallery(req.id, req.params.pet_id, req.query.image);

            res.status(204).end();

        } else {
            res.status(400).json({
                status: "Error",
                message: "Id image required. ⚠️",
                status_code: 400
            });
        }

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
}

exports.insertComment = async (req, res) => {
    try {
        const comment = await post.insertComment(req.id, req.params.pet_id, req.body, req.role);

        res.status(201).json({
            status: "Success",
            message: "Added comment ✅",
            status_code: 201,
            data: comment
        });

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            status_code: 500
        });
    }
};
