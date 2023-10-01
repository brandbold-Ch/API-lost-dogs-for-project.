/**
 * @author Brandon Jared Molina Vazquez
 * @date 26/09/2023
 * @file This module defines the schema for the dog model
 * @module DogSchema
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Scheme for storing information about a dog.
 * @typedef {Object} DogSchema
 * @property {string} dog_name - Name of the dog.
 * @property {string} gender - Gender of the dog ('Male' or 'Female').
 * @property {string} last_seen - Dog's last known location.
 * @property {string} description - Description of the dog.
 * @property {string} size - Dog size ('Small', 'Medium' or 'Large').
 * @property {string} breed - Dog breed.
 * @property {Date} lost_date - Date the dog was lost.
 * @property {boolean} found - Indicates whether the dog has been found (true/false).
 * @property {Array} tags - Tags associated with the dog.
 */

const dogSchema = new Schema({

    dog_name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Macho', 'Hembra'],
        required: true
    },
    last_seen: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    size: {
        type: String,
        enum: ['Pequeño', 'Mediano', 'Grande'],
        required: true
    },
    breed: {
        type: String,
        required: true
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
    tags: {
        type: Array,
        required: false,
        default: []
    }
})

module.exports = dogSchema;
