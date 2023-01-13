import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";

// Componente funcional
// Representará la sección en donde estará un listado con las notas
const NotesList = () => {

  // Utilizando 'useGetNotesQuery'
  const {
    data: notes, // Renombrando 'data' con 'notes'
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery();

  // Renderización en base a ciertas condiciones
  let content;

  if (isLoading) content = <p>Loading...</p>; // Si se están cargando los datos...

  if (isError) { // Si hay algún error...
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) { // Si hubo éxito al traer los datos...

    // Destructurar 'notes' para obtener los ids y las entidades
    const { ids } = notes;

    // Crear el 'cuerpo' de una tabla con la info de cada 'note'
    // Renderizar el componente 'Note'
    const tableContent = ids?.length
      ? ids.map(noteId => <Note key={noteId} noteId={noteId} />)
      : null;

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