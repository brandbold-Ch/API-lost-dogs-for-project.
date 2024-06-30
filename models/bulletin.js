const mongoose = require("mongoose");
const { Schema } = mongoose;


const bulletinModel = new Schema({

    title: {
        type: String,
        required: true,
    },
    body: {
        image: {
            type: Object,
            default: null,
            required: false
        },
        gallery: {
            type: Array,
            default: [],
            required: false
        },
        text: {
            type: String,
            required: true
        }
    },
    identify: {
        name_company: {
            type: String,
            required: true
        },
        address: {
            type: String,
            default: null,
            required: false
        },
        phone_number: {
            type: String,
            default: null,
            required: false
        },
        update: {
            type: Date,
            required: false,
            default: null
        },
        timestamp: {
            type: Date,
            default: Date.now()
        }
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "doc_model"
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

const Bulletin = mongoose.model("Bulletin", bulletinModel);
module.exports = { Bulletin }
