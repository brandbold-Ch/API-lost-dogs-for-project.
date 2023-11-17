const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const collabSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    identifier: {
        type: String,
        required: false
    }
});

const Collab = mongoose.model('Collab', collabSchema);
module.exports = Collab;
