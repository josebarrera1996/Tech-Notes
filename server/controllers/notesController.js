/* En este archivo desarrollaremos la lógica de los métodos de un CRUD */

// Importando los modelos
const User = require('../models/User');
const Note = require('../models/Note');
// Dependencias extras
const asyncHandler = require('express-async-handler'); // Evitar el uso repetitivo de los 'try/catch'

/* Definiendo los métodos */

// Método para traer todos las 'notes'
// Detalle importante, el mismo será de acceso privado
const getAllNotes = asyncHandler(async (req, res) => {

    // Obtener todas las 'notes' de la B.D
    const notes = await Note.find().exec();

    // Si no hay registros...
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' });
    }

    // Añadir el campo 'username' a cada 'note' del arreglo 'notes'
    const notesWithUsername = await Promise.all(notes.map(async (note) => {

        // Obtener los datos de cada uno de los 'user', gracias a el campo 'user' del modelo 'Note'
        const user = await User.findById(note.user).lean().exec();

        // Asignarle el campo 'username' a cada 'note'
        return { ...note, username: user.username };
    }));

    // Enviar en formato JSON la respuesta con los datos
    res.json(notesWithUsername);
});

// Método para crear una nueva 'note'
// Detalle importante, el mismo será de acceso privado
const createNewNote = asyncHandler(async (req, res) => {

    // Obteniendo los valores de los campos del body del request
    const { user, title, text } = req.body;

    // Chequear que todos hayan sido rellenados
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Chequear si hay una 'note' con el título duplicado
    const duplicate = await Note.findOne({ title }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    // Crear y almacenar en la B.D la 'note'
    const note = await Note.create({ user, title, text });

    if (note) {
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }
});

// Método para actualizar a una 'note'
// Detalle importante, el mismo será de acceso privado
const updateNote = asyncHandler(async (req, res) => {

    // Obteniendo los valores de los campos del body del request
    const { id, user, title, text, completed } = req.body;

    // Chequear que todos hayan sido rellenados
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Chequear que la 'note' exista en la B.D
    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    // Chequear si en la B.D ya hay una 'note' con el mismo 'title'
    const duplicate = await Note.findOne({ title }).lean().exec();

    // Permitir actualizaciones a la 'note' original 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    // Preparando los campos con los nuevos valores
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    // Registrar los nuevos cambios en la B.d
    const updatedNote = await note.save();

    // Enviar en formato JSON la siguiente respuesta
    res.json(`'${updatedNote.title}' updated`);
});

// Método para eliminar a una 'note'
// Detalle importante, el mismo será de acceso privado
const deleteNote = asyncHandler(async (req, res) => {
    
    // Obtener el 'id' del body del request
    const { id } = req.body;

    // Chequear que se le haya pasado el 'id'
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' });
    }

    // Comprobar que la 'note' exista en la B.D
    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    // Proceder a eliminarla de la B.D
    const result = await note.deleteOne();

    // Preparar el mensaje a enviar
    const reply = `Note '${result.title}' with ID ${result._id} deleted`;

    // Enviar en formato JSON la respuesta
    res.json(reply);
})

// Exportando los métodos
module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
};