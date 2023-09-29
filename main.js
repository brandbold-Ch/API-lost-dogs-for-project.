const express = require('express')
const userControllers = require('./controllers/userControllers')
const dogsControllers = require('./controllers/dogsControllers')
const appControllers = require('./controllers/appControllers')
const app = express()
const connection = require('./configurations/connection')


app.use(express.json())


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
        const user = await userControllers.getUser(req.params.id)

        if (user.length > 0) {
            res.status(200).json(user)
        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.delete('/api/users/:id/delete', async (req, res) => {
    try {
        const exist = await userControllers.getUser(req.params.id)

        if (exist.length > 0) {
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
        const exist = await userControllers.getUser(req.params.id)

        if (exist.length > 0) {
            await userControllers.updateUser(req.params.id, req.body)
            res.status(200).json({'message': 'Update user'})
        } else {
            res.status(404).json({'message': 'Not found user'})
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
        const exist = await userControllers.getUser(req.params.id)

        if (exist.length > 0) {
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

        if (posts.length > 0) {
            res.status(200).json(posts[0].lost_dogs)
        } else {
            res.status(404).json({'message': 'Not found user'})
        }

    } catch (error) {
        res.status(500).json({'message': error.message})
    }
})

app.get('/api/users/:id/posts/:dog_name', async (req, res) => {
    try {
        const user = await userControllers.getUser(req.params.id)
        const post = await dogsControllers.getPost(req.params.id, req.params.dog_name)

        if (user.length > 0) {

            if (post[0].lost_dogs.length > 0) {
                res.status(200).json(post[0].lost_dogs)
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

app.delete('/api/users/:id/posts/:dog_name/delete', async (req, res) => {
    try {
        const user = await userControllers.getUser(req.params.id)
        const post = await dogsControllers.getPost(req.params.id, req.params.dog_name)

        if (user.length > 0) {

            if (post[0].lost_dogs.length > 0) {
                await dogsControllers.delPost(req.params.id, req.params.dog_name)
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

app.put('/api/users/:id/posts/:dog_name/update', async (req, res) => {
    try {
        const user = await userControllers.getUser(req.params.id)
        const post = await dogsControllers.getPost(req.params.id, req.params.dog_name)

        if (user.length > 0) {

            if (post[0].lost_dogs.length > 0) {
                await dogsControllers.updatePost(req.params.id, req.params.dog_name, req.body)
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


/* ----------------------- Operations for the app ------------------------*/


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
