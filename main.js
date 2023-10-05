const { checkUserExists, checkPostExists } = require('./middlewares/entityManager')
const isAuthenticate = require('./middlewares/authenticate')
const userControllers = require('./controllers/userControllers');
const dogsControllers = require('./controllers/dogsControllers');
const appControllers = require('./controllers/forAllControllers');
const authControllers = require('./controllers/authControllers');
const connection = require('./configurations/connection');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

/* ----------------------- Operations CRUD for the users ---------------------------------- */


app.post('/api/users/login', async (req, res) => {
    try {
        const key = await authControllers.login(req.body)

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
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users', async (req, res) => {
    try {
        res.status(200).json(await userControllers.getUsers())
    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        const data = await userControllers.getUser(req.params.id)
        res.status(200).json(data[0])

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/credentials', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        const pass = await authControllers.getCredentials(req.params.id)
        res.status(200).json(pass[0])

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.delete('/api/users/:id/delete', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await userControllers.delUser(req.params.id)
        res.status(200).json({'message': 'Deleted user'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/update', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await userControllers.updateUser(req.params.id, req.body)
        res.status(200).json({'message': 'Update user'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/credentials/update', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await authControllers.updateCredentials(req.params.id, req.body)
        res.status(200).json({'message': 'Updated credentials'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.post('/api/users/new', async (req, res) => {
    try {
        await userControllers.setUser(req.body)
        res.status(201).json({'message': 'Added user'})
    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})


/* ----------------------- Operations CRUD for the lost dogs ------------------------*/

app.post('/api/users/:id/posts/new', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        await dogsControllers.insertLostDog(req.params.id, req.body)
        res.status(201).json({'message': 'Added post'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/posts', isAuthenticate, checkUserExists, async (req, res) => {
    try {
        const posts = await dogsControllers.getPosts(req.params.id)
        res.status(200).json(posts[0].lost_dogs)

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/posts/filter', isAuthenticate, checkUserExists, checkPostExists, async (req, res) => {
    try {
        const post = await dogsControllers.getPost(req.params.id, req.query.dog)
        res.status(200).json(post[0].lost_dogs[0])

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.delete('/api/users/:id/posts/delete', isAuthenticate, checkUserExists, checkPostExists, async (req, res) => {
    try {
        await dogsControllers.delPost(req.params.id, req.query.dog)
        res.status(200).json({'message': 'Deleted post'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/posts/update', isAuthenticate, checkUserExists, checkPostExists, async (req, res) => {
    try {
        await dogsControllers.updatePost(req.params.id, req.query.dog, req.body)
        res.status(200).json({'message': 'Updated post'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})


/* ----------------------- Operations without authentication ------------------------*/

app.get('/', (req, res) => {
    res.status(200).json({'message': `Welcome ${req.ip.substring(7)} to API to lost dogs`});
})

app.get('/dogs/lost', async (req, res) => {
    try {
        res.status(200).json(await appControllers.getAllLostDogs())
    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.listen(5000, () => {
    console.log("Listening")
})
