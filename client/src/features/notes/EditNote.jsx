import { useParams } from 'react-router-dom';
import { useGetNotesQuery } from './notesApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';
import useAuth from '../../hooks/useAuth';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';

// Componente funcional
// Será un 'contenedor' del formulario para editar a una 'Note'
const EditNote = () => {

  // Utilizando 'useTitle' para cambiar el título de la pestaña
  useTitle('techNotes: Edit Note');

  // Utilizando 'useParams'
  const { id } = useParams(); // Obteniendo el 'id' de los parámetros de la URL

  // Utilizando 'useAuth' para decodificar las siguientes propiedades del token
  const { username, isManager, isAdmin } = useAuth();

  // Utilizando 'useGetNotesQuery' para traer la respectiva 'Note'
  const { note } = useGetNotesQuery("notesList", { // De lo fijado en 'NoteList'
    selectFromResult: ({ data }) => ({
      note: data?.entities[id]
    }),
  })
  // Utilizando 'useGetUsersQuery' para traer a todos los 'User¿
  const { users } = useGetUsersQuery("usersList", { // De lo fijado en 'UsersList'
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  // Si no se pudo traer la 'Note' y los 'User'...
  if (!note || !users?.length) return <PulseLoader color={"#FFF"} />

  // Si el 'User' logeado no cumple con ninguno de los roles...
  if (!isManager && !isAdmin) {
    if (note.username !== username) { // Si no hay coincidencias entre el 'username' del que hizo la 'Note' y el logeado...
      return <p className="errmsg">No access</p>;
    }
  }

  // Si todo ha salido bien, mostrar lo siguiente
  const content = <EditNoteForm note={note} users={users} />;

  return content;
}

export default EditNote;