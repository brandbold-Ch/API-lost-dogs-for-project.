/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module defines the schema for the post model
 * @module PostSchema
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;


const postModel = new Schema({
    name: {
        type: String,
        required: false,
        default: "Sin nombre"
    },
    details: {
        specie: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: [
                "Macho",
                "Hembra"
            ],
            required: false,
            default: null
        },
        age: {
            type: String,
            required: false,
            default: null
        },
        description: {
            type: String,
            required: true
        },
        size: {
            type: String,
            enum: [
                "Chico",
                "Mediano",
                "Grande",
                "No aplica"
            ],
            required: false,
            default: null
        },
        breed: {
            type: String,
            required: false,
            default: null
        },
    },
    publication: {
        update: {
            type: Date,
            required: false,
            default: null
        },
        published: {
            type: Date,
            default: Date.now()
        },
        lost_date: {
            type: Date,
            required: true
        },
        location: {
            type: Object,
            required: false,
            default: null
        },
        last_seen: {
            type: String,
            required: false,
            default: null
        }
    },
    status: {
        found: {
            type: Boolean,
            enum: [
                true,
                false
            ],
            required: false,
            default: false
        },
        owner: {
            type: Boolean,
            required: false,
            default: true
        },
    },
    identify: {
        image: {
            type: Object,
            required: false,
            default: null
        },
        gallery: {
            type: Array,
            required: false,
            default: []
        },
    },
    feedback: {
        comments: {
            type: Array,
            required: false,
            default: []
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

postModel.index({ user_id: 1 });
const Post = mongoose.model("Post", postModel);
module.exports = { Post }
