const adminDocs = require("./adminDocs");
const authDocs = require("./authDocs");
const userDocs = require("./userDocs");
const rescuerDocs = require("./rescuerDocs");
const guestDocs = require("./guestDocs");


module.exports = {
    "openapi": "3.0.0",
    "info": {
        "title": "PET (Perdidos en Tapachula)",
        "version": "2.0",
        "description": "API pets lost"
    },
    "servers": [
        {
            "url": "http://localhost:5000"
        },
        {
            "url": "https://pabed-api-xi.vercel.app/"
        }
    ],
    "components": {
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    },
    "paths": {
        ...adminDocs,
        ...authDocs,
        ...userDocs,
        ...rescuerDocs,
        ...guestDocs
    }
}
