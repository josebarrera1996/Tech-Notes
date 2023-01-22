/* Archivo principal de la app */

// Dependencias, librerías, etc
require('dotenv').config(); // Para poder utilizar las variables de entorno definidas en este proyecto
// require('express-async-errors'); // Opcional -> Implementar un manejo de errores para todo el servidor (evitar la declaración de bloques try/catch)
const express = require('express');

// Definiendo la app al instanciar a Express
const app = express();


// Importando a 'path'
const path = require('path');

// Importando los middlewares
const { logEvents, logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');

// Definiendo el Puerto
const PORT = process.env.PORT || 3500;

// Implementando la conexión con la B.D de MongoDB
connectDB();

// Configuraciones extras (y middlewares)
app.use(logger); // Implementando el middleware personalizado para logear los requests
app.use(cors(corsOptions)); // Implementando este middleware para habilitar el uso de CORS (y permitir requests)
app.use(express.json()); // Nos permitirá trabajar con datos en formato JSON
app.use(cookieParser()); // Para el manejo (o análisis) de las cookies que recibimos
app.use('/', express.static(path.join(__dirname, 'public'))); // Indicando a Express donde están los archivos estáticos (css, images, etc)

/* Implementando las rutas */

app.use('/', require('./routes/root')); // Implementar la ruta raíz
app.use('/auth', require('./routes/authRoutes')); // Implementar la ruta para las 'auth'
app.use('/users', require('./routes/userRoutes')); // Implementar la ruta para los 'users'
app.use('/notes', require('./routes/noteRoutes')); // Implementar la ruta para las 'notes'

app.all('*', (req, res) => { // Para trabajar con solicitudes no manejadas

    // Estado '404'
    res.status(404);

    // Si la solicitud tiene un encabezado 'accepts' con 'html' (la más común)
    if (req.accepts('html')) {
        // Enviar como respuesta la vista desarrollada en el archivo '404.html'
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    // Si la solicitud tiene un encabezado 'accepts' en formato 'json' (por ej: solicitamos la petición en postman)
    else if (req.accepts('json')) {
        // Enviar este mensaje en formato json
        res.json({ message: '404 Not Found' });
    }
    // Si la solicitud con el encabezado 'accepts' no cumple con ninguno de los casos anteriores...
    else {
        // Enviar este archivo en formato '.txt'
        res.type('txt').send('404 Not Found');
    }
});

// Implementando el middleware personalizado para manejar errores
app.use(errorHandler);

// Luego de realizar la conexión con la B.D...
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    // Levantar el servidor
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Manejar errores de conexión
mongoose.connection.on('error', err => {

    // Mostrar por consola el error generado
    console.log(err);

    // Generando el log con el error
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})
