const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestsSchema = new Schema({
    timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    role: {
        type: String,
        required: true,
        enum: ["COLLABORATOR"]
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
    email: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collab",
        required: true,
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Request", requestsSchema);
