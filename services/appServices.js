const User = require('../models/user');


class AppServices {

    constructor() {}

    async getAllLostDogs(){
        return User.aggregate([{
            $project: {
                _id: 0,
                owner: "$name",
                cellphone: 1,
                lost_dogs: 1
            }
        }]);
    }
}

module.exports = AppServices;
