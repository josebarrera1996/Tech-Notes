import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectNoteById } from './notesApiSlice';
import { selectAllUsers } from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';

// Componente funcional
// Será un 'contenedor' del formulario para editar a una 'Note'
const EditNote = () => {

  // Utilizando 'useParams'
  const { id } = useParams(); // Obteniendo el 'id' de los parámetros de la URL

  // Utilizando 'useSelector' con los respectivos Hooks para traer los datos de la 'Note' que coincida con el ID 
  // Y a todos los 'Users' (con la finalidad de posteriormente elegir la 'id' deseada)
  const note = useSelector(state => selectNoteById(state, id));
  const users = useSelector(selectAllUsers);

  // Constante cuyo contenido dependerá de si se traen los siguientes datos...
  const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

  return content;
}

export default EditNote;