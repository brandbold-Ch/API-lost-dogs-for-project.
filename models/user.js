/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module is responsible for creating the user model.
 * @module authSchema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


/**
 * Mongoose schema for the user model.
 * @type {mongoose.Schema}
 */

const userModel = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: false,
        default: null,
        maxLength: 10,
    },
    social_networks: {
        type: Array,
        required: true,
        default: []
    },
    auth_id: {
        type: Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: "Auth"
    },
    posts_id: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
}, {
    versionKey: false
})

userModel.pre("save", function (next) {
    try {
        const socials = this.social_networks[0];
        this.social_networks = [];

        for (const key in socials) {
            this.social_networks.push({[key]: socials[key]});
        }
        next();

    } catch (err) {
        next(err);
    }
});

const User = mongoose.model("User", userModel);
module.exports = {
    User,
    userSchema: userModel
}
