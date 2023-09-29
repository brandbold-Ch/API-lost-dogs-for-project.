const dogsService = require('../services/dogsServices')
const service = new dogsService();


exports.insertLostDog = async (id, data_dog) => {
    await service.insertLostDog(id, data_dog)
}

exports.getPosts = async (id) => {
    return await service.getPosts(id)
}

exports.getPost = async (id, dog_name) => {
    return await service.getPost(id, dog_name)
}

exports.delPost = async (id, dog_name) => {
    await service.delPost(id, dog_name)
}

exports.updatePost = async (id, dog_name, dog_data) => {
    await service.updatePost(id, dog_name, dog_data)
}