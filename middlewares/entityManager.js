const userControllers = require('../controllers/userControllers');
const dogsControllers = require('../controllers/dogsControllers');

const checkUserExists = async (req, res, next) => {
    try {
        const user = await userControllers.getUser(req.params.id);

        if (user) {
            next();
        } else {
            res.status(404).json({'message': 'Not found user'});
        }

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
};

const checkMyPostExists = async (req, res, next) => {
    try {
        if (req.query.dog) {
            const post = await dogsControllers.getMiddlewareMyPost(req.params.id, req.query.dog);

            if (post['my_lost_dogs'].length){
                next();
            } else {
                res.status(404).json({'message': 'Not found post'});
            }

        } else if (req.query.id) {
            const post = await dogsControllers.getMyPostById(req.params.id, req.query.id);
            if (post){
                next();
            } else {
                res.status(404).json({'message': 'Not found post'});
            }

        } else {
            res.status(404).json({'message': 'You need to define the query to get the dog'});
        }


    } catch (error) {
        res.status(500).json({'message': error.message})
    }
};

const checkOtherPostExists = async (req, res, next) => {
    try {
        if (req.query.dog) {
            const post = await dogsControllers.getMiddlewareOtherPost(req.params.id, req.query.dog);
            if (post['the_lost_dogs'].length){
                next();
            } else {
                res.status(404).json({'message': 'Not found post'});
            }

        } else if (req.query.id) {
            const post = await dogsControllers.getOtherPostById(req.params.id, req.query.id);
            if (post){
                next();
            } else {
                res.status(404).json({'message': 'Not found post'});
            }

        } else {
            res.status(404).json({'message': 'You need to define the query to get the dog'});
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
};

const generalEndpoint = async (req, res, next) => {
    try {
        if (req.query.owner) {
            next();
        }
        else if (req.query.dog) {
            next();
        }
        else {
            res.status(404).json({'message': 'Parameters: owner=true or false; dog=id'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
}

module.exports = {
    checkUserExists,
    checkMyPostExists,
    checkOtherPostExists,
    generalEndpoint
};
