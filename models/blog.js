const mongoose = require("mongoose");
const { Schema } = mongoose;


const blogModel = new Schema({
    markdown_text: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: false,
        default: []
    },
    markers: {
        timestamp: {
            type: Date,
            default: Date.now()
        },
        update: {
            type: Date,
            required: false,
            default: null
        },
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
},{
    versionKey: false
});

const Blog = mongoose.model("Blog", blogModel);
module.exports = { Blog }
