const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const blogSchema = new Schema({
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
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = {Blog}
