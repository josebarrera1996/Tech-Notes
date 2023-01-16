import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';

// Componente funcional
// Será un 'contenedor' para el formulario que permite crear una nueva 'Note'
const NewNote = () => {

  // Utilizando 'useSelector' junto con 'selectAllUsers' para traer todos los 'Users'
  const users = useSelector(selectAllUsers);

  // Constante cuyo contenido dependerá de si se obtuvieron los 'Users' o no
  const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>;

  return content;
}

export default NewNote;