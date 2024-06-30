const multer = require('multer');
const upload = multer();

const processFormData = (req, res, next) => {
    upload.any()(req, res, (error) => {
        if (!error) {
            next();
        } else {
            return res.status(400).json({ message: error.message });
        }
    });
};

module.exports = processFormData;
