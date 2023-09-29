const userService = require('../services/userServices')
const service = new userService();


exports.getUsers = async () => {
    return await service.getAll()
}

exports.setUser = async (data) => {
    await service.create(data)
}

exports.getUser = async (id) => {
    return await service.getUser(id);
}

exports.delUser = async (id) => {
    await service.delUser(id)
}

exports.updateUser = async (id, data) => {
    await service.updateUser(id, data)
}
