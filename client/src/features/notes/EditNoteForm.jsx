import { useState, useEffect } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from '../../hooks/useAuth';

// Componente funcional
// Formulario para editar a una 'Note'
const EditNoteForm = ({ note, users }) => { // Destructurando las props

    // Utilizando 'useAuth' para manejar las propiedades del token decodificado
    const { isManager, isAdmin } = useAuth();

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();

    /* Utilizando los Hooks personalizados para manejar la actualización y eliminación */
    const [updateNote, {
        // Los respectivos estados después de llamar a la función
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation();

    const [deleteNote, {
        // Los respectivos estados después de llamar a la función
        isSuccess: isDelSuccess, // Renombrando esta propiedad para evitar confusiones
        isError: isDelError, // Renombrando esta propiedad para evitar confusiones
        error: delerror // Renombrando esta propiedad para evitar confusiones
    }] = useDeleteNoteMutation();

    /* Utilizando 'useState' para manejar los respectivos estados... */
    const [title, setTitle] = useState(note._doc.title);
    const [text, setText] = useState(note._doc.text);
    const [completed, setCompleted] = useState(note._doc.completed);
    const [userId, setUserId] = useState(note._doc.user);

    // Utilizando 'useEffect' para verificar el estado luego de haber invocado cualquiera de los Hooks
    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('');
            setText('');
            setUserId('');
            navigate('/dash/notes'); // Navegar hacia la lista de las 'Notes'
        }
    }, [isSuccess, isDelSuccess, navigate]);

    // Manejadores para controlar los cambios en los respectivos estados
    const onTitleChanged = e => setTitle(e.target.value);
    const onTextChanged = e => setText(e.target.value);
    const onCompletedChanged = e => setCompleted(prev => !prev);
    const onUserIdChanged = e => setUserId(e.target.value);

    // Verificiar si se puede 'guardar' al saber que los campos están llenos
    // Y no se está cargando...
    const canSave = [title, text, userId].every(Boolean) && !isLoading;

    // Método para actualizar la 'Note'
    const onSaveNoteClicked = async (e) => {
        if (canSave) {
            // Invocar el método
            await updateNote({ id: note.id, user: userId, title, text, completed });
        }
    }

    // Método para eliminar la 'Note'
    const onDeleteNoteClicked = async () => {
        // Invocar el método
        await deleteNote({ id: note.id });
    }

    // Formatear las fechas de los siguientes campos...
    const created = new Date(note._doc.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const updated = new Date(note._doc.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

    // Lista de opciones con los usuarios para poder elegir quién se encargará de cumplir la 'Note'
    // El campo a rescatar será el del 'id' del respectivo 'User'
    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    });

    // Clases que dependen de condiciones para que se implementen sus respectivos estilos...
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"; // Si hay error...
    const validTitleClass = !title ? "form__input--incomplete" : '';
    const validTextClass = !text ? "form__input--incomplete" : '';

    // Contenedor de errores
    const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

    // Botón para eliminar las 'Notes'. Siempre y cuando el 'User' sea 'Manager' o 'Admin'
    let deleteButton = null;
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteNoteClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        );
    }

    return (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Note #{note.ticket}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveNoteClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>
                <label className="form__label" htmlFor="note-title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="note-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="note-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="note-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="note-completed">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="note-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="note-username">
                            ASSIGNED TO:</label>
                        <select
                            id="note-username"
                            name="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )
}

export default EditNoteForm;