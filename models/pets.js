/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module defines the schema for the dog model
 * @module DogSchema
 */

const mongoose = require('mongoose');
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

const petSchema = new Schema({
    name: {
        type: String,
        required: false,
        default: 'Sin nombre'
    },
    specie: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Macho', 'Hembra'],
        required: true
    },
    age: {
        type: String,
        required: false
    },
    last_seen: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        required: true,
        default: ""
    },
    size: {
        type: String,
        enum: ['Chico', 'Mediano', 'Grande', 'No aplica'],
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    update: {
        type: Date,
        required: false,
        default: null
    },
    date: {
        type: Date,
        default: Date.now()
    },
    lost_date: {
        type: Date,
        required: true
    },
    found: {
        type: Boolean,
        enum: [true, false],
        required: true,
        default: false
    },
    owner: {
        type: Boolean,
        required: true,
        default: true
    },
    tags: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = petSchema;
