const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const adminSchema = new Schema({
    name: {
        type: String,
        required: false,
        default: null
    },
    lastname: {
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

module.exports = mongoose.model("Admin", adminSchema);
