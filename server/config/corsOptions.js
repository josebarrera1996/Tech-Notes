const allowedOrigins = require('./allowedOrigins');

// Aplicando el middleware
// Definiendo las opciones relacionadas a los CORS
const corsOptions = {

    origin: (origin, callback) => {

        // Permitir los CORS en los dominios alojados en el arreglo 'allowedOrigins' e incluso los que no tengan origen (Postman, etc)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);

        } else {

            // Caso contrario, arrojar este error aclarando que al origen desde el que se está accediendo a la app no estan permitidos los CORS
            callback(new Error('Not allowed by CORS'));
        }
    },

    // Configuraciones adicionales
    credentials: true,
    optionsSuccessStatus: 200
};

// Exportando este módulo
module.exports = corsOptions;

