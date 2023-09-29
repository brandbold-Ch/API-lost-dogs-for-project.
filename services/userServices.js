const User = require('../models/user')
const Auth = require('../models/auth')

class UserServices {
    constructor() {}

    /* Methods CRUD for the users */
    async create(data){
        const { email, password } = data;
        const { name, lastname, cellphone } = data;
        const user = new User({name, lastname, cellphone});
        const auth = new Auth({email, password, user: user._id});

        await auth.save();
        await user.save();
    }

    async getAll(){
        return User.find({});
    }

    async getUser(id){
         return User.find({_id: id})
    }

    async delUser(id){
         return User.deleteOne({_id: id})
    }

    async updateUser(id, data){
         return User.updateOne({_id: id}, {$set: data})
    }
}

module.exports = UserServices