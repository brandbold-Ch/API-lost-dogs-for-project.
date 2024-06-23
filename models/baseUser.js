const mongoose = require("mongoose");
const { Schema } = mongoose;


const baseUserModel = new Schema({
    name: {
        type: String,
        required: true
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

baseUserModel.pre("save", function (next) {
    try {
        const socials = this.social_networks[0];
        this.social_networks = Object.keys(socials).map(
            key => ({ [key]: socials[key] })
        );
        next();

    } catch (err) {
        next(err);
    }
});

module.exports = { baseUserModel }
