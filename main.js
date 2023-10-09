const { checkMyPostExists, checkOtherPostExists } = require('./middlewares/entityManager');
const { checkUserExists } = require('./middlewares/entityManager');
const { generalEndpoint} = require('./middlewares/entityManager');
const isAuthenticate = require('./middlewares/authenticate');
const userControllers = require('./controllers/userControllers');
const dogsControllers = require('./controllers/dogsControllers');
const appControllers = require('./controllers/forAllControllers');
const authControllers = require('./controllers/authControllers');
const connection = require('./configurations/connection');
const { useTreblle } = require('treblle');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv').config()
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

useTreblle(app, {
    apiKey:'aljulEbaflLbDgaMrGFE4Wc5BhTTQe0f',
    projectId: '54TZa6O4k6tYy0vJ'
});

/* ----------------------- Operations CRUD for the users ---------------------------------- */


app.post('/api/users/login', async (req, res) => {
    try {
        const key = await authControllers.login(req.body);

        if (req.body.email && req.body.password) {

            switch (key[0]) {
                case 200:
                    res.status(200).send(key[1]);
                    break;

                case 401:
                    res.status(401).json(key[1]);
                    break;

                case 404:
                    res.status(200).json(key[1]);
                    break;
            }
        } else {
            res.status(404).json({'message': 'Invalid credentials'});
        }

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.get('/api/users', async (req, res) => {
    try {
        res.status(200).json(await userControllers.getUsers());
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.get('/api/users/:id', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        res.status(200).json(await userControllers.getUser(req.params.id));

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.get('/api/users/:id/credentials', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        res.status(200).json(await authControllers.getCredentials(req.params.id));

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.delete('/api/users/:id/delete', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await userControllers.delUser(req.params.id);
        res.status(200).json({'message': 'Deleted user'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.put('/api/users/:id/update', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await userControllers.updateUser(req.params.id, req.body);
        res.status(200).json({'message': 'Update user'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.put('/api/users/:id/networks/update', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await userControllers.updateNetwork(req.params.id, req.query.social, req.body);
        res.status(200).json({'message': 'Updated social media'});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.put('/api/users/:id/credentials/update', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await authControllers.updateCredentials(req.params.id, req.body);
        res.status(200).json({'message': 'Updated credentials'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.post('/api/users/new', async (req, res) => {
    try {
        await userControllers.setUser(req.body);
        res.status(201).json({'message': 'Added user'});
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});


/* ----------------------- Operations CRUD for the lost dogs ------------------------*/

app.post('/api/users/:id/posts/new', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await dogsControllers.insertLostDog(req.params.id, req.body);
        res.status(201).json({'message': 'Added post'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.get('/api/users/:id/posts', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        res.status(200).json(await dogsControllers.getPosts(req.params.id, req.query.owner));

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

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

app.delete('/api/users/:id/posts/mine/delete', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        await dogsControllers.delMyPost(req.params.id, req.query.id);
        res.status(200).json({'message': 'Deleted post'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.delete('/api/users/:id/posts/other/delete', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        await dogsControllers.delOtherPost(req.params.id, req.query.id);
        res.status(200).json({'message': 'Deleted post'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.put('/api/users/:id/posts/mine/update', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        await dogsControllers.updateMyPost(req.params.id, req.query.id, req.body);
        res.status(200).json({'message': 'Updated post'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.put('/api/users/:id/posts/other/update', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        await dogsControllers.updateOtherPost(req.params.id, req.query.id, req.body);
        res.status(200).json({'message': 'Updated post'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.post('/api/users/:id/posts/mine/tags/new', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        await dogsControllers.insertTagsMyPost(req.params.id, req.query.id, req.body);
        res.status(200).json({'message': 'Added tag'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.post('/api/users/:id/posts/other/tags/new', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        await dogsControllers.insertTagsOtherPost(req.params.id, req.query.id, req.body);
        res.status(200).json({'message': 'Added tag'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.delete('/api/users/:id/posts/mine/tags/delete', isAuthenticate, checkUserExists, checkMyPostExists, async (req, res) => {
    try {
        await dogsControllers.delTagsMyPost(req.params.id, req.query.id, req.query.key, req.query.value);
        res.status(200).json({'message': 'Deleted tag'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.delete('/api/users/:id/posts/other/tags/delete', isAuthenticate, checkUserExists, checkOtherPostExists, async (req, res) => {
    try {
        await dogsControllers.delTagsOtherPost(req.params.id, req.query.id, req.query.key, req.query.value);
        res.status(200).json({'message': 'Deleted tag'});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

/* ----------------------- Operations without authentication ------------------------*/

app.get('/', (req, res) => {
    res.status(200).json({'message': 'Welcome API to lost dogs'});
});

app.get('/api/dogs/lost', generalEndpoint, async (req, res) => {
    try {
        console.log(process.env.port)
        res.status(200).json(await appControllers.getAllLostDogs(req.query.owner));
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.get('/api/dogs/lost/board', generalEndpoint, async (req, res) => {
    try {
        res.status(200).json(
            await appControllers.getUserAndDog(
                req.query.user, req.query.dog, req.query.owner
            )
        );
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
});

app.listen(5000, () => {
    console.log("Listening");
});
