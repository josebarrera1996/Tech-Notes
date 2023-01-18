/* En este archivo se desarrollarán las rutas para trabajar con la autenticación & autorización de los 'Users' */
// Y se implementarán los métodos definidos en el respectivo controlador

const express = require('express');
const router = express.Router(); // Definiendo el enrutador
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');

/* Definiendo las rutas */

router.route('/') // Ruta raíz 'auth'
    // Implementando un 'middleware'
    .post(loginLimiter, authController.login);

router.route('/refresh') // Ruta 'auth/refresh'
    .get(authController.refresh);

router.route('/logout') // Ruta 'auth/logout'
    .post(authController.logout);

// Exportando el módulo
module.exports = router;