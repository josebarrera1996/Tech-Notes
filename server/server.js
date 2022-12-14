/* Archivo principal de la app */

// Dependencias, librerías, etc
const express = require('express');

// Definiendo la app al instanciar a Express
const app = express();

// Importando a 'path'
const path = require('path');

// Definiendo el Puerto
const PORT = process.env.PORT || 3500;

// Configuraciones extras
app.use('/', express.static(path.join(__dirname, '/public'))); // Indicando a Express donde están los archivos estáticos (css, images, etc)

app.use('/', require('./routes/root')); // Implementar la ruta raíz

app.all('*', (req, res) => { // Para manejar solicitudes no manejadas

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

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});