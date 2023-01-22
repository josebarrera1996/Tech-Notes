import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useGetNotesQuery } from './notesApiSlice';
import { memo } from 'react';

// Componente funcional
// Representará la estructura de una 'Note'
const Note = ({ noteId }) => { // Propiedad destructurada 'noteId'

    // Utilizando 'useGetNotesQuery' para llenar este componente con los datos de la 'Note' que coincida
    const { note } = useGetNotesQuery("notesList", { // Coincidencia con lo fijado en el componente 'NoteList'
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId]
        })
    });

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();

    // Si la 'Note' existe...
    if (note) {

        // Convertir el campo 'createdAt' con el siguiente formato
        const created = new Date(note._doc.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' });
        // Convertir el campo 'updatedAt' con el siguiente formato
        const updated = new Date(note._doc.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' });
        // Dirección para poder editar a la 'Note'
        const handleEdit = () => navigate(`/dash/notes/${noteId}`);

        return (
            <tr className="table__row">
                <td className="table__cell note__status">
                    {note._doc.completed
                        ? <span className="note__status--completed">Completed</span>
                        : <span className="note__status--open">Open</span>
                    }
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{note._doc.title}</td>
                <td className="table__cell note__username">{note.username}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null;
};

// Con esto el componente se 'renderizará' si hay cambios en él
const memoizedNote = memo(Note);

export default memoizedNote;