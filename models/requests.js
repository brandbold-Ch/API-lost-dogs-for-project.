const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestsSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    role: {
        type: String,
        required: true,
        enum: ['COLLABORATOR']
    },
    status: {
        type: String,
        enum: ['pendiente', 'activo', 'inactivo', 'rechazado'],
        default: 'pendiente'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collab',
        required: true,
    }
});

const Request = mongoose.model('Request', requestsSchema);
module.exports = Request;
