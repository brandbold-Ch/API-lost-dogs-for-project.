const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
