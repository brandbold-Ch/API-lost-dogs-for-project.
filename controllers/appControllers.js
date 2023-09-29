const appService = require('../services/appServices')
const service = new appService();


exports.getAllLostDogs = async () => {
    return await service.getAllLostDogs()
}
