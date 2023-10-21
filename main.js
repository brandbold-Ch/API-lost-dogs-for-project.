/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file In this module are the API endpoints.
 */

const { checkMyPostExists, checkOtherPostExists } = require('./middlewares/entityManager');
const { checkUserExists } = require('./middlewares/entityManager');
const { generalEndpoint} = require('./middlewares/entityManager');
const isAuthenticate = require('./middlewares/authenticate');
const userControllers = require('./controllers/userControllers');
const dogsControllers = require('./controllers/petsControllers');
const appControllers = require('./controllers/forAllControllers');
const authControllers = require('./controllers/authControllers');
const connection = require('./configurations/connection');
const { useTreblle } = require('treblle');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(morgan('dev'));

useTreblle(app, {
    apiKey: process.env.API_KEY,
    projectId: process.env.PROJECT_ID
});

/**
 * Operations CRUD for the users.
 * @namespace
 * @name UserOperations
 */

/**
 * User login endpoint.
 * @function
 * @async
 * @name loginUser
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.post('/api/users/login', async (req, res) => {
    try {
        const key = await authControllers.login(req.body);

        if (req.body.email && req.body.password) {

            switch (key[0]) {
                case 202:
                    res.status(202).json(key[1]);
                    break;

                case 401:
                    res.status(401).json(key[1]);
                    break;

                case 404:
                    res.status(404).json(key[1]);
                    break;
            }
        } else {
            res.status(404).json({'message': 'Invalid credentials'});
        }

    } catch (error) {
        res.status(400).json({'message': error.message});
    }
});

/**
 * Get all users endpoint.
 * @function
 * @async
 * @name getAllUsers
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/users', async (req, res) => {
    try {
        res.status(200).json(await userControllers.getUsers());
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Get user by ID endpoint.
 * @function
 * @async
 * @name getUserById
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/users/:id', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        res.status(200).json(await userControllers.getUser(req.params.id));

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Get user credentials by ID endpoint.
 * @function
 * @async
 * @name getUserCredentials
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/users/:id/credentials', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        res.status(200).json(await authControllers.getCredentials(req.params.id));

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Delete user by ID endpoint.
 * @function
 * @async
 * @name deleteUserById
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.delete('/api/users/:id/delete', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await userControllers.delUser(req.params.id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Update user by ID endpoint.
 * @function
 * @async
 * @name updateUserById
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.put('/api/users/:id/update', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await userControllers.updateUser(req.params.id, req.body);
        res.status(202).json({'message': 'Update user'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Update user network by ID and social platform endpoint.
 * @function
 * @async
 * @name updateNetworkById
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.put('/api/users/:id/networks/update', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await userControllers.updateNetwork(req.params.id, req.query.social, req.body);
        res.status(202).json({'message': 'Updated social media'});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Update user credentials by ID endpoint.
 * @function
 * @async
 * @name updateCredentialsById
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.put('/api/users/:id/credentials/update', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await authControllers.updateCredentials(req.params.id, req.body);
        res.status(202).json({'message': 'Updated credentials'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Add new user endpoint.
 * @function
 * @async
 * @name addUser
 * @memberof UserOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.post('/api/users/new', async (req, res) => {
    try {
        await userControllers.setUser(req.body);
        res.status(201).json({'message': 'Added user'});
    } catch (error) {
        res.status(400).json({'message': error.message});
    }
});

/**
 * Operations CRUD for the lost dogs.
 * @namespace
 * @name LostDogsOperations
 */

/**
 * Insert a lost dog endpoint.
 * @function
 * @async
 * @name insertLostDog
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.post('/api/users/:id/posts/new', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await dogsControllers.insertLostPet(req.params.id, req.body);
        res.status(201).json({'message': 'Added post'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Get posts of a user by ID endpoint.
 * @function
 * @async
 * @name getUserPostsById
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/users/:id/posts', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        res.status(200).json(await dogsControllers.getPosts(req.params.id, req.query.owner));

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Get posts of a user by ID and filter by dog name or post ID endpoint.
 * @function
 * @async
 * @name getUserPostsFilter
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/users/:id/posts/mine/filter', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        if (req.query.dog) {
            res.status(200).json(await dogsControllers.getMyPostByName(req.params.id, req.query.dog));
        }else {
            res.status(200).json(await dogsControllers.getMyPostById(req.params.id, req.query.id));
        }

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Get posts of a user by ID and filter by dog name or post ID endpoint.
 * @function
 * @async
 * @name getUserPostsFilter
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/users/:id/posts/other/filter', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        if (req.query.dog) {
            res.status(200).json(await dogsControllers.getOtherPostByName(req.params.id, req.query.dog));
        }else {
            res.status(200).json(await dogsControllers.getOtherPostById(req.params.id, req.query.id));
        }

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Delete a post of a user by ID and post ID endpoint.
 * @function
 * @async
 * @name deleteMyPostById
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.delete('/api/users/:id/posts/mine/delete', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        await dogsControllers.delMyPost(req.params.id, req.query.id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Delete a post of a user by ID and post ID endpoint.
 * @function
 * @async
 * @name deleteOtherPostById
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.delete('/api/users/:id/posts/other/delete', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        await dogsControllers.delOtherPost(req.params.id, req.query.id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Update a post of a user by ID and post ID endpoint.
 * @function
 * @async
 * @name updateMyPostById
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.put('/api/users/:id/posts/mine/update', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        await dogsControllers.updateMyPost(req.params.id, req.query.id, req.body);
        res.status(202).json({'message': 'Updated post'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Update a post of a user by ID and post ID endpoint.
 * @function
 * @async
 * @name updateOtherPostById
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.put('/api/users/:id/posts/other/update', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        await dogsControllers.updateOtherPost(req.params.id, req.query.id, req.body);
        res.status(202).json({'message': 'Updated post'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Add tags to a post of a user by ID and post ID endpoint.
 * @function
 * @async
 * @name addTagsToMyPost
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.post('/api/users/:id/posts/mine/tags/new', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        await dogsControllers.insertTagsMyPost(req.params.id, req.query.id, req.body);
        res.status(201).json({'message': 'Added tag'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Add tags to a post of a user by ID and post ID endpoint.
 * @function
 * @async
 * @name addTagsToOtherPost
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.post('/api/users/:id/posts/other/tags/new', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        await dogsControllers.insertTagsOtherPost(req.params.id, req.query.id, req.body);
        res.status(201).json({'message': 'Added tag'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Delete tags from a post of a user by ID, post ID, tag key, and tag value endpoint.
 * @function
 * @async
 * @name deleteTagsFromMyPost
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.delete('/api/users/:id/posts/mine/tags/delete', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        await dogsControllers.delTagsMyPost(req.params.id, req.query.id, req.query.key, req.query.value);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Delete tags from a post of a user by ID, post ID, tag key, and tag value endpoint.
 * @function
 * @async
 * @name deleteTagsFromOtherPost
 * @memberof LostDogsOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.delete('/api/users/:id/posts/other/tags/delete', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        await dogsControllers.delTagsOtherPost(req.params.id, req.query.id, req.query.key, req.query.value);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Operations without authentication.
 * @namespace
 * @name PublicOperations
 */

/**
 * Welcome message endpoint.
 * @function
 * @name welcomeMessage
 * @memberof PublicOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/', (req, res) => {
    res.status(200).json({'message': 'Welcome API to lost pets'});
});

/**
 * Get all lost dogs endpoint.
 * @function
 * @name getAllLostDogs
 * @memberof PublicOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/pets/lost', generalEndpoint, async (req, res) => {
    try {
        res.status(200).json(await appControllers.getAllLostPets(req.query.owner));
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.get('/api/pets/all', async (req, res) => {
    try {
        res.status(200).json(await appControllers.getAllPets());
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Get user and dog information endpoint.
 * @function
 * @name getUserAndDog
 * @memberof PublicOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/pets/lost/board', checkUserExists, generalEndpoint, async (req, res) => {
    try {
        res.status(200).json(
            await appControllers.getUserAndPet(
                req.query.user, req.query.pet, req.query.owner
            )
        );
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Get lost pets by species endpoint.
 *
 * @function
 * @name getLostPetsBySpecies
 * @memberof PublicOperations
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

app.get('/api/pets/lost/specie', async (req, res) => {
    try {
        res.status(200).json(await appControllers.getSpecies(req.query.owner, req.query.type));
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/**
 * Start the Express server.
 * @function
 * @name startServer
 * @param {number} port - Port to listen on.
 * @returns {void}
 */

app.listen(parseInt(process.env.PORT, 10), () => {
    console.log("Listening requests");
});
