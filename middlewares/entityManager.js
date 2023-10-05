const userControllers = require('../controllers/userControllers')
const dogsControllers = require('../controllers/dogsControllers');

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

const checkPostExists = async (req, res, next) => {
    try {
        const post = await dogsControllers.getPost(req.params.id, req.query.dog);

        if (post[0].lost_dogs.length > 0){
            next();
        } else {
            res.status(404).json({'message': 'Not found post'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
}

module.exports = {
    checkUserExists,
    checkPostExists
}