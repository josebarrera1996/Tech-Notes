/* En este archivo se desarrollarán las rutas para trabajar con los 'users' */
// Y se implementarán los métodos definidos en el respectivo controlador

const express = require('express');
const router = express.Router(); // Definiendo el enrutador
const usersController = require('../controllers/usersController');

/* Definiendo las rutas */

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

// Exportando el módulo
module.exports = router;