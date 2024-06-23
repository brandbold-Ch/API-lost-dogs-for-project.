const mongoose = require("mongoose");
const { Schema } = mongoose;


const adminModel = new Schema({
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
    auth_id: {
        type: Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: "Auth"
    }
}, {
    versionKey: false
});

const Admin = mongoose.model("Admin", adminModel);
module.exports = { Admin }
