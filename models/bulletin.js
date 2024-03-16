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
            required: true
        },
        te_number: {
            type: String,
            required: true
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
