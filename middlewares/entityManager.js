/**
 * @author Brandon Jared Molina Vazquez
 * @date 30/09/2023
 * @file This module is for user middleware.
 */

const { posts, auths, admins, bulletins } = require('../singlenton/instances');

/**
 * Middleware to check if a user with the specified ID exists.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const checkBulletinExists = async (req, res, next) => {
    try {
        const bulletin = await bulletins.getBulletin(req.id, req.params.bulletin_id);

        if (bulletin) {
            next();
        } else {
            res.status(404).json({message: 'Not found bulletin 🚫'});
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const checkUserExists = async (req, res, next) => {
    try {
        const entity = await auths.getUser(req.query.user || req.id);

        if (entity) {
            next();
        } else {
            res.status(404).json({message: 'Not found user 🚫'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const checkPostExists = async (req, res, next) => {
    try {
        let entity;

        if (req.baseUrl === '/api/v2/posts' && req.path !== '/comment') {
            entity = await posts.getPost(req.query.user || req.id, req.params.pet_id || req.query.pet);
        } else {
            entity = await posts.getGeneralPost(req.params.pet_id || req.query.pet);
        }

        if (entity) {
            next();
        } else {
            res.status(404).json({message: 'Not found post 🚫'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const checkQueryParameters = async (req, res, next) => {
    try {
        const link = req.query.value;
        const value = req.path.split('/').pop();

        const choices = {
            size: ['Chico', 'Mediano', 'Grande'],
            gender: ['Hembra', 'Macho'],
            owner: ['true', 'false'],
            found: ['true', 'false'],
            id: [],
            breed: [],
            specie: ['Perro', 'Gato', 'Ave']
        }

        if (link && choices[value].includes(link) || choices[value].length === 0) {
            next();
        } else {
            res.status(400).json({message: `The parameters must be 👉 ${choices[value]} 👈`});
        }

    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

const checkTrust = async (req, res, next) => {
    try {

        if (req.body.token === process.env.TRUSTED_PERMISSIONS) {
            next();
        } else {
            res.status(403).json({message: 'Can\'t create an administrator account 💩'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const isActive = async (req, res, next) => {
    try {

        if (req.role === "COLLABORATOR") {
            const request = await admins.getRequestForMiddlewareIsActive(req.id);

            if (request['status'] === 'pending') {
                res.status(403).json({message: 'You are in a waiting process, ' +
                        'the administrator must activate your account ⏳'});
            }
            else if (request['status'] === 'rejected') {
                res.status(401).json({message: 'Your request was rejected by the administrator 🚫'});
            }
            else if (request['status'] === 'active') {
                next();
            }
            else {
                res.status(403).json({message: 'Your account is deactivated 📴'});
            }
        } else {
            next();
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const checkRequestExists = async (req, res, next) => {
    try {
        const request = await admins.getRequestForMiddlewareCheck(req.params.id);

        if (request) {
            next();
        } else {
            res.status(404).json({message: 'Not found request 🚫'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const checkQueryAction = async (req, res, next) => {
    try {
        const choices = [
            "activate",
            "deactivate",
            "reject"
        ];

        if (choices.includes(req.query.action)) {
            next();
        } else {
            res.status(400).json({message: `The parameters must be 👉 ${choices} 👈`});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const checkQueryStatus = async (req, res , next) => {
    try {
        const choices = [
            'pending',
            'active',
            'disabled',
            'rejected'
        ];

        if (choices.includes(req.query.status)) {
            next();
        } else {
            res.status(400).json({message: `The parameters must be 👉 ${choices} 👈`});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    checkUserExists,
    checkPostExists,
    checkQueryParameters,
    checkTrust,
    isActive,
    checkRequestExists,
    checkQueryStatus,
    checkQueryAction,
    checkBulletinExists
};
