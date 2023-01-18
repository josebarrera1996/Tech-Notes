const jwt = require('jsonwebtoken');

// Middleware para verificar si el 'User' está realmente autenticado y autorizado
const verifyJWT = (req, res, next) => {
    // Obtener de los 'headers' la propiedad 'authorization' o 'Authorization'
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // Si no empieza con ' Bearer '...
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Si lo hay, obtener el token (sin la secuencia 'Bearer ') que es el de 'acceso'
    const token = authHeader.split(' ')[1];

    // Realizar la decodificación
    jwt.verify(
        token, // token de acceso
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            // Si hay algún error...
            if (err) return res.status(403).json({ message: 'Forbidden' });
            // Si no hubo errores...
            // Crear dos nuevos campos en el request con lo obtenido al decodificar
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles
            next(); // Seguir con el curso de la aplicación
        }
    );
}

// Exportar este middleware
module.exports = verifyJWT;