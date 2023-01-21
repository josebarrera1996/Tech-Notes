import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from '../../hooks/useAuth';

// Componente funcional
// Representará la sección en donde estará un listado con las 'Notes'
const NotesList = () => {

  // Utilizando 'useAuth' para manejar las propiedades (decodificadas del token)
  const { username, isManager, isAdmin } = useAuth();

  // Utilizando 'useGetNotesQuery'
  const {
    data: notes, // Renombrando 'data' con 'notes'
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery('notesList', {
    // Configuraciones opcionales
    pollingInterval: 15000, // Frecuencia con la que se recargarán los datos (15 segundos)
    refetchOnFocus: true, // Si estamos en otra 'ventana' y regresamos, se recargarán los datos
    refetchOnMountOrArgChange: true // Si cargamos nuevamente el componente, lo mismo pasará con los datos
  });

  // Renderización en base a ciertas condiciones
  let content;

  if (isLoading) content = <p>Loading...</p>; // Si se están cargando los datos...

  if (isError) { // Si hay algún error...
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) { // Si hubo éxito al traer los datos...

    // Destructurar 'notes' para obtener los ids y las entidades
    const { ids, entities } = notes;
    // Realizar un filtrado...
    let filteredIds;
    if (isManager || isAdmin) {
      // Si el 'User' cumple con alguno de estos roles, puede ver TODAS las 'Notes'
      filteredIds = [...ids];
    } else {
      // Si no lo cumple ('Employee'), solo podrá ver las 'Notes' que haya realizado él
      filteredIds = ids.filter(noteId => entities[noteId].username === username);
    }

    // Crear el 'cuerpo' de una tabla con la info de cada 'note'
    // Renderizar el componente 'Note'
    const tableContent = ids?.length && filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">Status</th>
            <th scope="col" className="table__th note__created">Created</th>
            <th scope="col" className="table__th note__updated">Updated</th>
            <th scope="col" className="table__th note__title">Title</th>
            <th scope="col" className="table__th note__username">Owner</th>
            <th scope="col" className="table__th note__edit">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }

  return content;
}

export default NotesList;