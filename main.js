const userControllers = require('./controllers/userControllers')
const dogsControllers = require('./controllers/dogsControllers')
const appControllers = require('./controllers/appControllers')
const connection = require('./configurations/connection')
const morgan = require('morgan')
const express = require('express')
const app = express()

app.use(express.json())
app.use(morgan('dev'))


/* -------------------------------- Users and Posts verify -----------------------------------*/

async function userExists(id) {
    const user = await userControllers.getUser(id);
    return user.length > 0;
}

async function postExists(id, dog_name) {
    const post = await dogsControllers.getPost(id, dog_name)
    return post[0].lost_dogs.length > 0;
}

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

app.get('/api/users/:id', async (req, res) => {
    try {
        const data = await userControllers.getUser(req.params.id)

        if (await userExists(req.params.id)) {
            res.status(200).json(data[0])
        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/credentials', async (req, res) => {
    try {

        if (await userExists(req.params.id)){
            const pass = await userControllers.getCredentials(req.params.id)
            res.status(200).json(pass[0])
        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.delete('/api/users/:id/delete', async (req, res) => {
    try {

        if (await userExists(req.params.id)) {
            await userControllers.delUser(req.params.id)
            res.status(200).json({'message': 'Delete user'})
        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/update', async (req, res) => {
    try {

        if (await userExists(req.params.id)) {
            await userControllers.updateUser(req.params.id, req.body)
            res.status(200).json({'message': 'Update user'})
        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/credentials/update', async (req, res) => {
    try {

        if (await userExists(req.params.id)){
            await userControllers.updateCredentials(req.params.id, req.body)
            res.status(200).json({'message': 'Update credentials'})
        }

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

app.post('/api/users/:id/posts/new', async (req, res) => {
    try {

        if (await userExists(req.params.id)) {
            await dogsControllers.insertLostDog(req.params.id, req.body)
            res.status(201).json({'message': 'Added post'})
        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/posts', async (req, res) => {
    try {
        const posts = await dogsControllers.getPosts(req.params.id)

        if (await userExists(req.params.id)) {
            res.status(200).json(posts[0].lost_dogs)
        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/posts/filter', async (req, res) => {
    try {
        const post = await dogsControllers.getPost(req.params.id, req.query.dog)

        if (await userExists(req.params.id)) {

            if (await postExists(req.params.id, req.query.dog)) {
                res.status(200).json(post[0].lost_dogs[0])
            } else {
                res.status(404).json({'message': 'Not found post'})
            }

        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.delete('/api/users/:id/posts/delete', async (req, res) => {
    try {

        if (await userExists(req.params.id)) {

            if (await postExists(req.params.id, req.query.dog)) {
                await dogsControllers.delPost(req.params.id, req.query.dog)
                res.status(200).json({'message': 'Delete post'})
            } else {
                res.status(404).json({'message': 'Not found post'})
            }

        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.put('/api/users/:id/posts/update', async (req, res) => {
    try {

        if (await userExists(req.params.id)) {

            if (await postExists(req.params.id, req.query.dog)) {
                await dogsControllers.updatePost(req.params.id, req.query.dog, req.body)
                res.status(200).json({'message': 'Update post'})
            } else {
                res.status(404).json({'message': 'Not found post'})
            }

        } else {
            res.status(404).json({'message': 'Not found user'})
        }
    } catch (error) {
        res.status(200).json()
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
