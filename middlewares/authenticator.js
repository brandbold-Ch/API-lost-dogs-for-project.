/**
 * @author Brandon Jared Molina Vazquez
 * @date 30/09/2023
 * @file This module is for user authentication.
 */

const jwt = require("jsonwebtoken");
require("dotenv").config();


const templateErrorResponse = (status_code, message, base_url, role, status, method) => {
    return {
        status: status,
        error: {
            status_code: status_code,
            message: message,
            details: {
                base_url: base_url,
                allowed_role: role,
                method: method
            }
        }
    }
}

/**
 * Middleware to check the authentication using JSON Web Tokens (JWT).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const isAuthenticate = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization;
        let allowed_role;

        const routes = {
            USER: [
                '/api/v2/users',
                '/api/v2/users/bulletins',
                '/api/v2/auth'
            ],
            RESCUER: [
                '/api/v2/rescuers',
                '/api/v2/auth',
            ],
            ADMINISTRATOR: [
                '/api/v2/admins',
                '/api/v2/auth'
            ]
        };

        switch (req.baseUrl) {
            case "/api/v2/users":
                allowed_role = "USER";
                break;

            case "/api/v2/rescuers":
                allowed_role = "RESCUER";
                break;

            case "/api/v2/admins":
                allowed_role = "ADMINISTRATOR";
                break;
        }

        if (token) {

            // Verify the token and attach user information to the request object
            const key = jwt.verify(token.substring(7), process.env.SECRET_KEY);

            if (key.role) {
                const permissions = key.role.map(role => {
                    return routes[role].includes(req.baseUrl);
                });

                if (permissions.some(role => role === true)) {
                    req.id = key.user;
                    req.role = key.role;
                    next();

                } else {
                    res.status(401).json(
                        templateErrorResponse(
                            401,
                            "You don´t have access to this route 🚫",
                            req.baseUrl,
                            allowed_role,
                            "No permissions",
                            req.method
                        )
                    );
                }

            } else {
                res.status(401).json(
                    templateErrorResponse(
                        401,
                        "Your role does not exist in the system 😒",
                        req.baseUrl,
                        undefined,
                        "Does not exist",
                        req.method
                    )
                );
            }

        } else {
            res.status(400).json(
                templateErrorResponse(
                    400,
                    "You didn't send the token 🙄",
                    req.baseUrl,
                    undefined,
                    "No access",
                    req.method
                )
            );
        }

    } catch (error) {

        res.status(500).json(
            templateErrorResponse(
                500,
                error.message,
                req.baseUrl,
                undefined,
                "Authentication failed",
                req.method
            )
        );
    }
};

module.exports = isAuthenticate;
