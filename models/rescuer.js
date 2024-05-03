const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const rescuerSchema = new Schema({
    name: {
        type: String,
        required: false,
        default: null
    },
    address: {
        type: String,
        required: false,
        default: null
    },
    identifier: {
        type: String,
        required: false,
        default: null
    },
    description: {
        type: String,
        required: false,
        default: null
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
    }]
}, {
    versionKey: false
});


const requestsSchema = new Schema({
    timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    role: [{
        type: String,
        required: true,
        enum: [
            "RESCUER",
            "USER"
        ]
    }],
    status: {
        type: String,
        enum: [
            "pending",
            "active",
            "disabled",
            "rejected"
        ],
        default: "pending"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "doc_model",
        required: true,
    },
    doc_model: {
        type: String,
        required: true,
        enum: ["User", "Rescuer"]
    }
}, {
    versionKey: false
});

requestsSchema.index({user: 1}, {unique: true});

const Request = mongoose.model("Request", requestsSchema);
const Rescuer = mongoose.model("Rescuer", rescuerSchema);
module.exports = {
    Rescuer,
    Request
};
