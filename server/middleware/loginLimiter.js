const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

// Se utilizará esta librería para 'limitar' solicitudes repetidas a API's públicas y/o endpoints
// En este caso orientado a lo que es el 'login' del 'User'
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5, // Limitar cada IP a 5 solicitudes de inicio de sesión por "ventana" por minuto
    message:
        { message: 'Too many login attempts from this IP, please try again after a 60 second pause' },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Devolver información de límite de tasa en los encabezados `RateLimit-*`
    legacyHeaders: false, // Deshabilite los encabezados `X-RateLimit-*`
});

// Exportando este middleware
module.exports = loginLimiter;
