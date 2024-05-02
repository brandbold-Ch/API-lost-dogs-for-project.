const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const bulletinSchema = new Schema({

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
        te_number: {
            type: String,
            default: null,
            required: false
        },
        update: {
            type: Date,
            required: false
        },
        timestamp: {
            type: Date,
            default: Date.now()
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "doc_model"
    },
    doc_model: {
        type: String,
        required: true,
        enum: [
            "User",
            "Rescuer"
        ]
    }
}, {
    versionKey: false
});

const Bulletin = mongoose.model("Bulletin", bulletinSchema);
module.exports = {Bulletin}
