const userControllers = require('../controllers/userControllers')

const checkUserExists = async (req, res, next) => {
    try {
        const user = await userControllers.getUser(req.params.id)

        if (user.length > 0) {
            next()
        } else {
            res.status(404).json({'message': 'Not found user'})
        }
    } catch (error) {
        res.status(500).json({'message': error.message})
    }
}

module.exports = checkUserExists;