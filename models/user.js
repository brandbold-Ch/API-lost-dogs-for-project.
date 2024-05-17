/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module is responsible for creating the user model.
 * @module authSchema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Schema to store information about a user.
 * @typedef {Object} UserSchema
 * @property {string} name - Name of the user.
 * @property {string} lastname - Last name of the user.
 * @property {string} cellphone - User's phone number.
 * @property {string} email - User's email address.
 * @property {Array} my_networks - Array that stores user's social media networks.
 * @property {Array} my_lost_dogs - Array that stores lost pets associated with the user.
 * @property {Array} the_lost_pets - Array that stores lost pets associated with other users.
 */

/**
 * Mongoose schema for the user model.
 * @type {mongoose.Schema}
 */

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    cellphone: {
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
    auth: {
        type: Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: "Auth"
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }],
    bulletins: [{
        type: Schema.Types.ObjectId,
        ref: "Bulletin"
    }],
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: "Blog"
    }]
}, {
    versionKey: false
});


userSchema.pre("save", function (next) {
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

/**
 * Mongoose model for the user model.
 * @type {mongoose.Model<UserSchema>}
 */

const User = mongoose.model("User", userSchema);
module.exports = { User }
