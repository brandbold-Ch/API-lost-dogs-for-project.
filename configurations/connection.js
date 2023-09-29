const mongoose = require('mongoose')
const { db } = require('./config')

const connection = mongoose.connect(`mongodb://${db.host}:${db.port}/${db.database}`)
    .then(() => {
        console.log("Successful connection")
    }).catch(() => {
        console.log("Connection error")
    })

module.exports = connection
