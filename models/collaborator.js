const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const collabSchema = new Schema({
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
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Collab", collabSchema);
