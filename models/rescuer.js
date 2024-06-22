const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const rescuerModel = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        required: false,
        default: null
    },
    description: {
        type: String,
        required: false,
        default: null
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
    }],
    bulletins_id: [{
        type: Schema.Types.ObjectId,
        ref: "Bulletin"
    }],
    blogs_id: [{
        type: Schema.Types.ObjectId,
        ref: "Blog"
    }]
}, {
    versionKey: false
});


const requestsModel = new Schema({
    timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    requester_role: [{
        type: String,
        required: true,
        enum: [
            "RESCUER",
            "USER"
        ]
    }],
    requested_role: {
        type: String,
        required: true,
        enum: [
            "RESCUER",
            "ASSOCIATION"
        ]
    },
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
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "doc_model",
        required: true,
    },
    doc_model: {
        type: String,
        required: true,
        enum: [
            "User",
            "Rescuer",
            "Association"
        ]
    }
}, {
    versionKey: false
});

requestsModel.pre("save", function(next) {
    delete this.lastname;
    next();
})

requestsModel.index({user_id: 1}, {unique: true});
const Request = mongoose.model("Request", requestsModel);
const Rescuer = mongoose.model("Rescuer", rescuerModel);
module.exports = {
    Rescuer,
    Request,
    rescuerSchema: rescuerModel
}
