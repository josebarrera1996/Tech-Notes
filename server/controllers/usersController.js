/* En este archivo desarrollaremos la lógica de los métodos de un CRUD */

// Importando los modelos
const User = require('../models/User');
const Note = require('../models/Note');
// Dependencias extras
const asyncHandler = require('express-async-handler'); // Evitar el uso repetitivo de los 'try/catch'
const bcrypt = require('bcrypt');

/* Definiendos los métodos */

// Método para traer todos los 'users'
// Detalle importante, esta ruta será de acceso privado
const getAllUsers = asyncHandler(async (req, res) => {

    // Obtener, de una manera limpia, los usuarios de la B.D (sin el campo 'password')
    const users = await User.find().select('-password').lean();

    // Si no hay usuarios...
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    // Si hay 'users', enviar en formato JSON
    res.json(users);
});

// Método para crear un nuevo 'user'
// Detalle importante, esta ruta será de acceso privado
const createUser = asyncHandler(async (req, res) => {

    // Obtener los respectivos datos de los campos del body del request
    const { username, password, roles } = req.body;

    // Chequear si hemos llenado todos los campos
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Chequear si ya hay un 'username' con el mismo valor en la B.D
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // Realizar el hashing a la password, esto la encriptará cuando insertemos en la B.D
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    // Crear el objeto a insertar con los datos llenados (con la password transformada)
    const userObject = { username, "password": hashedPwd, roles };

    // Crear y almacenar el 'user' en la B.D
    const user = await User.create(userObject);

    // Chequear si el 'user' se creó de manera exitosa o no...
    if (user) { // Creación exitosa...
        res.status(201).json({ message: `New user ${username} created` });
    } else { // Fallo en la creación...
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

// Método para actualizar un 'user'
// Detalle importante, esta ruta será de acceso privado
const updateUser = asyncHandler(async (req, res) => {

    // Obtener los siguientes valores de los respectivos campos del body del request
    const { _id, username, roles, active, password } = req.body; 

    // Chequear que todos los campos, a excepción de la password (opcional), están llenos
    if (!_id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    // Chequear si el usuario existe al consultarlo en la B.D y traer sus datos
    const user = await User.findById(_id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Chequear si en la B.D ya hay con el 'username' que se quiere ingresar
    const duplicate = await User.findOne({ username }).lean().exec();

    // Permitir actualizaciones a el 'user' original
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // Preparando los campos con los nuevos valores
    user.username = username;
    user.roles = roles;
    user.active = active;

    // Si se decide actualizar la 'password', realizar la respectiva encriptación
    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10); // salt rounds 
    }

    // Registrar los nuevos cambios en la B.D
    const updatedUser = await user.save();

    // Enviar en formato JSON la siguiente respuesta
    res.json({ message: `${updatedUser.username} updated` });
});

// Método para eliminar un 'user'
// Detalle importante, esta ruta será de acceso privado
const deleteUser = asyncHandler(async (req, res) => {

    // Obtener el 'id' del body del request
    const { id } = req.body;

    // Chequear que se le esté pasando el campo 'id'
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    // Chequear si el 'user' tiene 'note' asignada
    const note = await Note.findOne({ user: id }).lean().exec();

    // De ser así, retornar el siguiente mensaje impidiendo la eliminación
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    // Chequear si el usuario existe en la B.D
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Alojar en esta constante a el objeto que ha sido eliminado de la B.D
    const result = await user.deleteOne();

    // Prepara el mensaje a enviar
    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    // Enviar en formato JSON la siguiente respuesta
    res.json(reply);
});

// Exportando los métodos
module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};