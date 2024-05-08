class HandlerHttpVerbs {

    constructor() {
    }

    static templateForErrors(message, bodyError) {
        const {status, url, role, code, verb} = bodyError;

        return {
            status: status,
            error: {
                status_code: code,
                message: message,
                details: {
                    base_url: url,
                    allowed_role: role,
                    method: verb
                }
            }
        }
    }

    static templateForSuccess(message, bodySuccess) {
        const {data, status, code, url, verb} = bodySuccess;

        return {
            status: status,
            data: data,
            description: {
                status_code: code,
                message: message,
                details: {
                    base_url: url,
                    method: verb
                }
            }
        }
    }

    static forbidden(message, bodyParam) {

        return HandlerHttpVerbs.templateForErrors(message, {
            status: "Forbidden 💥",
            code: 403,
            ...bodyParam
        });
    }

    static internalServerError(message, bodyParam) {

        return HandlerHttpVerbs.templateForErrors(message, {
            status: "Internal server error 💀",
            code: 500,
            ...bodyParam
        });
    }

    static notFound(message, bodyParam) {

        return HandlerHttpVerbs.templateForErrors(message, {
            status: "Not found 🤷‍♂️",
            code: 404,
            ...bodyParam
        });
    }

    static badRequest(message, bodyParam) {

        return HandlerHttpVerbs.templateForErrors(message, {
            status: "Bad request 🤨",
            code: 400,
            ...bodyParam
        });
    }

    static unauthorized(message, bodyParam) {

        return HandlerHttpVerbs.templateForErrors(message, {
            status: "Unauthorized 🔒",
            code: 401,
            ...bodyParam
        });
    }

    static ok(message, bodyParam) {

        return HandlerHttpVerbs.templateForSuccess(message, {
            status: "Ok 👍",
            code: 200,
            ...bodyParam
        });
    }

    static created(message, bodyParam) {

        return HandlerHttpVerbs.templateForSuccess(message, {
            status: "Created 🎊",
            code: 201,
            ...bodyParam
        });
    }

    static accepted(message, bodyParam) {

        return HandlerHttpVerbs.templateForSuccess(message, {
            status: "Accepted 🤝",
            code: 202,
            ...bodyParam
        });
    }

    static continue(message, bodyParam) {

        return HandlerHttpVerbs.templateForSuccess(message, {
            status: "Continue ⏭️",
            code: 100,
            ...bodyParam
        });
    }

    static automaticClientErrorSelection(message, bodyParam, withHttpCode) {

        switch (withHttpCode) {

            case 400:
                return HandlerHttpVerbs.badRequest(message, bodyParam);

            case 401:
                return HandlerHttpVerbs.unauthorized(message, bodyParam);

            case 403:
                return HandlerHttpVerbs.forbidden(message, bodyParam);

            case 404:
                return HandlerHttpVerbs.notFound(message, bodyParam);
        }
    }
}

module.exports = {HandlerHttpVerbs}
