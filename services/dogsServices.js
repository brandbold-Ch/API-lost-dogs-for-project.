const User = require('../models/user')


class DogsServices {
    constructor() {}


    /* Methods CRUD for the dogs */
    async insertLostDog(id, dog_data) {
        return User.updateOne({_id: id}, {$push: {lost_dogs: dog_data}})
    }

    async getPosts(id) {
        return User.find({_id: id}, {lost_dogs: 1})
    }

    async getPost(id, dog_name) {
        return User.find({_id: id}, {lost_dogs: {$elemMatch: {dog_name: dog_name}}})
    }

    async delPost(id, dog_name) {
        return User.updateOne({_id: id}, {$pull: {lost_dogs: {dog_name: dog_name}}})
    }

    async updatePost(id, dog_name, dog_data) {
        return User.updateOne(
            {_id: id, "lost_dogs.dog_name": dog_name},
            {$set: {"lost_dogs.$": dog_data}}
        )
    }
}

module.exports = DogsServices;