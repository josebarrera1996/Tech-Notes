/* Middleware personalizado */

// Importando el método para mostrar logs
const { logEvents } = require('./logger')

// Desarrollando el middleware para logear los errores
const errorHandler = (err, req, res, next) => {

    // Invocando el método para poder crear el archivo (con el nombre especificado) y sus respectivos mensajes
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');

    // Mostrar por consola detalles adicionales sobre los errores que obtengamos
    console.log(err.stack);

    // Chequear si la respuesta que obtenemos ya tiene un código de estado y si lo tiene asignarlo a esta variable
    // Caso contrario, asignar el valor de '500' que hace referencia a un error en el servidor
    const status = res.statusCode ? res.statusCode : 500; // server error 

    // Enviar el estado
    res.status(status);

    // Enviar en formato JSON el error con su respectivo mensaje
    res.json({ message: err.message });
};

// Exportando el middleware
module.exports = errorHandler;