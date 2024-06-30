const {blog} = require("../utils/instances");
const {HandlerHttpVerbs} = require("../errors/handlerHttpVerbs");


exports.createBlog = async (req, res) => {
    try {
        const response_body = await blog.setBlog(
            req.id,
            [JSON.parse(JSON.stringify(req.body)), req.files],
            req.role
        );

        res.status(201).json(
            HandlerHttpVerbs.created(
                "Added blog ✅",
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

exports.updateBlog = async (req, res) => {
    try {
        const response_body = await blog.updateBlog(
            req.id, req.params.blog_id,
            [JSON.parse(JSON.stringify(req.body)), req.files]
        );

        res.status(202).json(
            HandlerHttpVerbs.accepted(
                "Updated blog ✅",
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

exports.getBlog = async (req, res) => {
    try {
        res.status(200).json(await blog.getBlog(req.id, req.params.blog_id));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getBlogs = async (req, res) => {
    try {
        res.status(200).json(await blog.getBlogs(req.id));

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
        await blog.deletePartialGallery(req.id, req.params.blog_id, req.query.id);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        await blog.deleteBlog(req.id, req.params.blog_id, req.role);
        res.status(204).end();

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}
