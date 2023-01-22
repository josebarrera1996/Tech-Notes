/* Este archivo representará el modelo de la colección 'Users' */

const mongoose = require('mongoose');

// Declarando el Schema
const userSchema = new mongoose.Schema({

    // Definiendo los campos
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    roles: {
        type: [String],
        default: ["Employee"]
    },

    active: {
        type: Boolean,
        default: true
    }
});

// Definiendo el Schema
module.exports = mongoose.model('User', userSchema);
