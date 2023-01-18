/* En este archivo se desarrollarán las rutas para trabajar con las 'notes' */
// Y se implementarán los métodos definidos en el respectivo controlador

const express = require('express');
const router = express.Router(); // Definiendo el enrutador
const verifyJWT = require('../middleware/verifyJWT');
const notesController = require('../controllers/notesController');

/* Definiendo las rutas */

// Aplicando el siguiente 'middleware' a todas las rutas
router.use(verifyJWT);

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

// Exportando el módulo
module.exports = router;