const express = require('express');
const router = express.Router(); // Definiendo el enrutador
const path = require('path');

// Definiendo la ruta inicial (o raíz)
router.get('^/$|/index(.html)?', (req, res) => {

    // Enviar como respuesta la vista desarrollada en 'index.html'
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Exportando el módulo
module.exports = router;