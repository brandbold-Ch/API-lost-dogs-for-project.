/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module defines the schema for the dog model
 * @module DogSchema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Schema for storing information about a dog.
 * @typedef {Object} DogSchema
 * @property {string} name - Name of the pet.
 * @property {string} gender - Gender of the dog ('Macho' or 'Hembra').
 * @property {string} age - Age of the dog.
 * @property {string} last_seen - Dog's last known location.
 * @property {string} description - Description of the dog.
 * @property {Object} image - Image information (cloudinary, URL, etc.).
 * @property {string} size - Dog size ('Pequeño', 'Mediano', or 'Grande').
 * @property {string} breed - Dog breed.
 * @property {Date} date - Date the dog's information was added.
 * @property {Date} lost_date - Date the dog was lost.
 * @property {boolean} found - Indicates whether the dog has been found (true/false).
 * @property {boolean} owner - Indicates whether the user is the owner of the dog (true/false).
 * @property {Array<string>} tags - Tags associated with the dog.
 */

const postSchema = new Schema({
    
    name: {
        type: String,
        required: false,
        default: "Sin nombre"
    },
    details: {
        specie: {
            type: String,
            required: false,
            default: null
        },
        gender: {
            type: String,
            enum: ["Macho", "Hembra"],
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
            required: false,
            default: null
        },
        size: {
            type: String,
            enum: ["Chico", "Mediano", "Grande", "No aplica"],
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
            required: false,
            default: null
        },
        coordinates: {
            type: Object,
            required: false,
            default: null
        }
    },
    status: {
        found: {
            type: Boolean,
            enum: [true, false],
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
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, {
    versionKey: false
});

postSchema.index({ user: 1 });
module.exports = mongoose.model("Post", postSchema);
