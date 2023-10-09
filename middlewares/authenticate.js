const jwt = require('jsonwebtoken');

const isAuthenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (token) {
            req.user = jwt.verify(token.substring(7), 'my-secret-key');
            next();
        } else {
            res.status(401).json({'message': 'Not received token'});
        }

    } catch (error) {
        res.status(401).json({'message': error.message});
    }
};

module.exports = isAuthenticate;