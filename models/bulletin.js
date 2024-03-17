const mongoose = require("mongoose")
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
            default: null,
            required: false
        }
    },
    identify: {
        name_company: {
            type: String,
            default: null,
            required: false
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
        timestamp: {
            type: Date,
            default: Date.now()
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Collab"
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Bulletin", bulletinSchema);
