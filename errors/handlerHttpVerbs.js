const { statusCodes, errorsCodes } = require("../utils/codes");


class HandlerHttpVerbs {

    constructor() {}

    static errorTemplate(message, bodyError) {
        const { status, url, role, codes, verb } = bodyError;
        return {
            status: status,
            error: {
                codes: codes,
                message: message,
                details: {
                    baseUrl: url,
                    allowedRole: role,
                    method: verb
                }
            }
        }
    }

    static successTemplate(message, bodySuccess) {
        const { data, status, codes, url, verb } = bodySuccess;
        return {
            status: status,
            data: data,
            description: {
                codes: codes,
                message: message,
                details: {
                    baseUrl: url,
                    method: verb
                }
            }
        }
    }

    static forbidden(message, extraError, bodyParam) {
        return HandlerHttpVerbs.errorTemplate(message, {
            status: "Forbidden 💥",
            codes: {
                statusCode: statusCodes.FORBIDDEN,
                errorCode: extraError
            },
            ...bodyParam
        });
    }

    static internalServerError(message, bodyParam) {
        return HandlerHttpVerbs.errorTemplate(message, {
            status: "Internal server error 💀",
            codes: {
                statusCode: statusCodes.INTERNAL_SERVER_ERROR,
                errorCode: errorsCodes.SERVER_UNKNOWN_ERROR
            },
            ...bodyParam
        });
    }

    static notFound(message, extraError, bodyParam) {
        return HandlerHttpVerbs.errorTemplate(message, {
            status: "Not found 🤷‍♂️",
            codes: {
                statusCode: statusCodes.NOT_FOUND,
                errorCode: extraError
            },
            ...bodyParam
        });
    }

    static badRequest(message, extraError, bodyParam) {
        return HandlerHttpVerbs.errorTemplate(message, {
            status: "Bad request 🤨",
            codes: {
                statusCode: statusCodes.BAD_REQUEST,
                errorCode: extraError
            } ,
            ...bodyParam
        });
    }

    static unauthorized(message, extraError, bodyParam) {
        return HandlerHttpVerbs.errorTemplate(message, {
            status: "Unauthorized 🔒",
            codes: {
                statusCode: statusCodes.UNAUTHORIZED,
                errorCode: extraError
            },
            ...bodyParam
        });
    }

    static ok(message, extraError, bodyParam) {
        return HandlerHttpVerbs.successTemplate(message, {
            status: "Ok 👍",
            codes: {
                statusCode: statusCodes.OK,
                errorCode: extraError
            },
            ...bodyParam
        });
    }

    static created(message, extraError, bodyParam) {
        return HandlerHttpVerbs.successTemplate(message, {
            status: "Created 🎊",
            codes: {
                statusCode: statusCodes.CREATED,
                errorCode: extraError
            },
            ...bodyParam
        });
    }

    static accepted(message, extraError, bodyParam) {
        return HandlerHttpVerbs.successTemplate(message, {
            status: "Accepted 🤝",
            codes: {
                statusCode: statusCodes.ACCEPTED,
                errorCode: extraError
            },
            ...bodyParam
        });
    }

    static continue(message, extraError, bodyParam) {
        return HandlerHttpVerbs.successTemplate(message, {
            status: "Continue ⏭️",
            codes: {
                statusCode: statusCodes.CONTINUE,
                errorCode: extraError
            },
            ...bodyParam
        });
    }

    static automaticSelectionError(message, bodyParam, extraError, withHttpCode) {
        switch (withHttpCode) {

            case 400:
                return HandlerHttpVerbs.badRequest(message, extraError, bodyParam);

            case 401:
                return HandlerHttpVerbs.unauthorized(message, extraError, bodyParam);

            case 403:
                return HandlerHttpVerbs.forbidden(message, extraError, bodyParam);

            case 404:
                return HandlerHttpVerbs.notFound(message, extraError, bodyParam);
        }
    }
}

module.exports = { HandlerHttpVerbs }
