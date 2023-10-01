const User = require('../models/user')
const Auth = require('../models/auth')
const bcrypt = require('bcrypt')
const e = require("express");

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

    async getCredentials(id){
        return Auth.find({user: id}, {user: 0, _id: 0})
    }

    async delUser(id){
        await Auth.deleteOne({user: id})
        await User.deleteOne({_id: id})
    }

    async updateUser(id, data){
        await User.updateOne({_id: id}, {$set: data}, {runValidators: true})
    }

    async updateCredentials(id, data){
        let { email, password } = data
        password = await bcrypt.hash(password, 10)
        await Auth.updateOne({user: id}, {$set: {email: email, password: password}}, {runValidators: true})
    }
}

module.exports = UserServices