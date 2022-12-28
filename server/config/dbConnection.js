/* En este archivo desarrollaremos la lógica para conectarnos con MongoDB */

const mongoose = require('mongoose');

// Para descartar el mensaje de advertencia que nos viene al conectarnos con MongoDB
mongoose.set("strictQuery", false);

// Método para conectarnos
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (error) {
        console.log(error);
    }
};

// Exportando el módulo
module.exports = connectDB;