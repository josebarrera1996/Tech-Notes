const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

/* Definiendo los métodos */

// Método para realizar el 'login'
// Ruta de acceso 'pública'
const login = asyncHandler(async (req, res) => {
    // Obtener del 'body' los siguientes campos
    const { username, password } = req.body;

    // Si no los hemos colocado...
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Verificiar si el 'User' existe en la B.D
    const foundUser = await User.findOne({ username }).exec();
    // Si no existe o el usuario está inactivo...
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Comparar ambas password's (la de texto plano con la encriptada)
    const match = await bcrypt.compare(password, foundUser.password);
    // Si no coinciden...
    if (!match) return res.status(401).json({ message: 'Unauthorized' });

    // Generar el token de acceso (al firmarlo)
    const accessToken = jwt.sign(
        {
            // La información de aquí (este objeto) es la que será insertada en este token
            // Para luego 'destructurarlo' cuando estemos del lado del cliente
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } // Expirará en '15' minutos
    );
    // Generar el token de 'refresh' (al firmarlo)
    const refreshToken = jwt.sign(
        // La información de aquí (este objeto) es la que será insertada en este token
        // Para luego 'destructurarlo' cuando estemos del lado del cliente
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // Expirará en '7' días
    );

    // Crear 'cookie' segura con token de actualización al utilizar el token de acceso para 'refresh'
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // Accesible solamente desde el servidor
        secure: true, // https
        sameSite: 'None', // cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 // Expiración de la Cookie: para que coincida con el token de 'refresh'
    });

    // Enviar el token de acceso que contiene el 'username' y los 'roles'
    res.json({ accessToken });
});

// Método para realizar un 'refresh' al haber expirado el 'token'
// Ruta de acceso 'pública'
const refresh = asyncHandler(async (req, res) => {
    // Obteniendo las 'cookies'
    const cookies = req.cookies;
    // Si no tenemos c'cookies' que tengan la propiedad 'jwt'...
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    // Si las tenemos...
    // Almacenarla en esta constante
    const refreshToken = cookies.jwt;

    // Realizar la 'verificación' para obtener el token decodificado...
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            // Si encontrarmos algún error...
            if (err) return res.status(403).json({ message: 'Forbidden' });
            // Encontrar el 'User' (al decodificarlo)....
            const foundUser = await User.findOne({ username: decoded.username }).exec();
            // Si no existe...
            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

            // Si existe, se creará un nuevo token de acceso
            const accessToken = jwt.sign(
                {
                    // La información de aquí (este objeto) es la que será insertada en este token
                    // Para luego 'destructurarlo' cuando estemos del lado del cliente
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } // Expirará en '15' minutos
            );
            // Enviar en formato json el token de acceso
            res.json({ accessToken });
        })
    );
});

// Método para realizar un 'deslogeo' y eliminar la respectiva 'Cookie'
// Ruta de acceso 'pública'
const logout = asyncHandler(async (req, res) => {
    // Obtener las 'cookies'
    const cookies = req.cookies;
    // Si no las obtenemos...
    if (!cookies?.jwt) return res.sendStatus(204);
    // Proceder a limpiarlas...
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    // Enviar en formato JSON la respuesta
    res.json({ message: 'Cookie cleared' });
});

// Exportando los métodos
module.exports = {
    login,
    refresh,
    logout
}