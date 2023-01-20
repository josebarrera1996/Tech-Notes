import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';

// Componente funcional
// Será un 'contenedor' para el formulario que permite crear una nueva 'Note'
const NewNote = () => {

  // Utilizando 'useSelector' junto con 'selectAllUsers' para traer todos los 'Users'
  const users = useSelector(selectAllUsers);

  // Verificando si hay 'Users' disponibles (más que nada si estamos autorizados para verlos)
  if (!users?.length) return <p>Not Currently Available</p>
  // Constante cuyo contenido dependerá de si se obtuvieron los 'Users' o no
  const content = <NewNoteForm users={users} />

  return content;
}

export default NewNote;