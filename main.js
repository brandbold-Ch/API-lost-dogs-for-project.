const userControllers = require('./controllers/userControllers');
const dogsControllers = require('./controllers/dogsControllers');
const appControllers = require('./controllers/appControllers');
const connection = require('./configurations/connection');
const checkUserExists = require('./middlewares/userVerify')
const checkPostExists = require('./middlewares/postVerify')
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

/* ----------------------- Operations CRUD for the users ---------------------------------- */

app.get('/', (req, res) => {
    res.status(200).json({'message': 'Welcome API to lost dogs'})
})

app.get('/api/users', async (req, res) => {
    try {
        res.status(200).json(await userControllers.getUsers())
    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id', checkUserExists, async (req, res) => {
    try {
        const data = await userControllers.getUser(req.params.id)
        res.status(200).json(data[0])

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/credentials', checkUserExists, async (req, res) => {
    try {
        const pass = await userControllers.getCredentials(req.params.id)
        res.status(200).json(pass[0])

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.delete('/api/users/:id/delete', checkUserExists, async (req, res) => {
    try {
        await userControllers.delUser(req.params.id)
        res.status(200).json({'message': 'Delete user'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/update', checkUserExists, async (req, res) => {
    try {
        await userControllers.updateUser(req.params.id, req.body)
        res.status(200).json({'message': 'Update user'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/credentials/update', checkUserExists, async (req, res) => {
    try {
        await userControllers.updateCredentials(req.params.id, req.body)
        res.status(200).json({'message': 'Update credentials'})

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

app.post('/api/users/:id/posts/new', checkUserExists, async (req, res) => {
    try {
        await dogsControllers.insertLostDog(req.params.id, req.body)
        res.status(201).json({'message': 'Added post'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/posts', checkUserExists, async (req, res) => {
    try {
        const posts = await dogsControllers.getPosts(req.params.id)
        res.status(200).json(posts[0].lost_dogs)

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/posts/filter', checkPostExists, async (req, res) => {
    try {
        const post = await dogsControllers.getPost(req.params.id, req.query.dog)
        res.status(200).json(post[0].lost_dogs[0])

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.delete('/api/users/:id/posts/delete', checkPostExists, async (req, res) => {
    try {
        await dogsControllers.delPost(req.params.id, req.query.dog)
        res.status(200).json({'message': 'Delete post'})

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/posts/update', checkPostExists, async (req, res) => {
    try {
        await dogsControllers.updatePost(req.params.id, req.query.dog, req.body)
        res.status(200).json({'message': 'Update post'})

    } catch (error) {
        res.status(200).json({'message': error.message})
    }
})


/* ----------------------- Operations without authentication ------------------------*/


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
