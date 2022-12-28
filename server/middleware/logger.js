/* Middleware personalizado */

const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Este método será utilizado como un 'helper' para logear los eventos
const logEvents = async (message, logFileName) => {

    // Variable para reprensetar la fecha en formato 'año-mes-día | horas:minutos:segundos'
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');

    // Se asignará un id específico para cada log con su respectiva fecha y mensaje
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {

        // Chequear si el directorio no existe...
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {

            // Procederemos a crearlo
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        // Si ya existe...
        // Utilizar el método 'appendFile' para agregar de forma asíncrona los datos proporcionados a un archivo. Se crea un nuevo archivo si no existe.
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);

    } catch (error) {

        console.log(error);
    }
}

// Desarrollando el middleware
const logger = (req, res, next) => {

    // Invocando el método para logear todos los 'requests' y el nombre del archivo que se generará en la carpeta 'logs'
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');

    // Logear el método y el path del request
    console.log(`${req.method} ${req.path}`);

    // Para que avance al siguiente middleware o el controlador para que el 'request' sea procesado
    next();
}

// Exportando el middleware
module.exports = { logEvents, logger };
