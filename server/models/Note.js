/* Este archivo representará el modelo de la colección 'Notes' */

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Declarando el Schema
const noteSchema = new mongoose.Schema(

    {
        // Definiendo los campos
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User' // Refiriendonos a el Schema de 'User'
        },

        title: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        // Configuraciones opcionales
        timestamps: true // Para añadir 2 nuevos campos: createdAt & updatedAt
    }
);

// Implementando el campo 'ticket' que sea autoincrementable de manera secuencial
// A su vez creará una nueva colección de ayuda llamada 'Counter'
noteSchema.plugin(AutoIncrement, {

    // Configuraciones
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
});

// Definiendo el Schema
module.exports = mongoose.model('Note', noteSchema);
