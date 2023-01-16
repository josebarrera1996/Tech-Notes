import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";

// Componente funcional
// Representará un 'contenedor' que es a su vez un formulario
const NewNoteForm = ({ users }) => { // Destructurando la props

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();

    // Utilizando el Hook personalizado para manejar la creación de una nueva 'Note'
    const [addNewNote, {
        // Los estados después de llamar a esta función
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation();

    /* Utilizando 'useState' para manejar los siguientes estados */
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [userId, setUserId] = useState(users[0].id); // El valor por defecto será el 'id' del primer 'User'

    // Utilizando 'useEffect' para verificar el estado luego de haber invocado la mutación
    useEffect(() => {
        if (isSuccess) {
            // Resetear los siguientes estados..
            setTitle('');
            setText('');
            setUserId('');
            navigate('/dash/notes'); // Navegar hacia la lista de las 'Notes'
        }
    }, [isSuccess, navigate]);

    /* Manejadores para controlar los cambios en los siguientes campos (y sus respectivos estados) */
    const onTitleChanged = e => setTitle(e.target.value);
    const onTextChanged = e => setText(e.target.value);
    const onUserIdChanged = e => setUserId(e.target.value);

    // Verificar si los campos han sido llenados de forma correcta
    // Y no se está cargando...
    const canSave = [title, text, userId].every(Boolean) && !isLoading;

    // Método para insertar una nueva 'Note' en la B.D
    const onSaveNoteClicked = async (e) => {
        e.preventDefault(); // Para evitar que la página se recargue
        if (canSave) { // Si se puede guardar, invocar la función
            await addNewNote({ user: userId, title, text });
        }
    }

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
    const errClass = isError ? "errmsg" : "offscreen"; // Si hay error...
    const validTitleClass = !title ? "form__input--incomplete" : '';
    const validTextClass = !text ? "form__input--incomplete" : '';

    return (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveNoteClicked}>
                <div className="form__title-row">
                    <h2>New Note</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>

            </form>
        </>
    );
}

export default NewNoteForm;