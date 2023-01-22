import { useGetUsersQuery } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';

// Componente funcional
// Será un 'contenedor' para el formulario que permite crear una nueva 'Note'
const NewNote = () => {

  // Utilizando 'useTitle' para cambiar el título de la pestaña
  useTitle('techNotes: New Note');

  // Utilizando 'useGetUsersQuery' para traer a todos los 'User'
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    })
  });

  // Si no se los pudo traer...
  if (!users?.length) return <PulseLoader color={"#FFF"} />
  // Si se los pudo traer...
  const content = <NewNoteForm users={users} />

  return content;
}

export default NewNote;