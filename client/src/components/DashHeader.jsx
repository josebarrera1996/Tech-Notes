import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';
// REGEX
const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

// Componente funcional
// Representará el 'encabezado' del dash
const DashHeader = () => {

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();
    // Utilizando 'useLocation'
    const { pathname } = useLocation(); // Para obtener la propiedad 'pathname'

    // Utilizando 'useAuth' para manejar las propiedades decodificadas del token
    const { isManager, isAdmin } = useAuth();

    // Utilizando el hook personalizado para poder deslogearnos
    const [sendLogout, {
        // Los estados después de llamar a esta función
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    // Utilizando 'useEffect' para chequear si todo fue un éxito....
    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);

    // Botones para manejar la navegación
    const onNewNoteClicked = () => navigate('/dash/notes/new');
    const onNewUserClicked = () => navigate('/dash/users/new');
    const onNotesClicked = () => navigate('/dash/notes');
    const onUsersClicked = () => navigate('/dash/users');

    // Clase dinámica dependiendo si se cumple con los REGEX
    let dashClass = null;
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small";
    }

    // Clase dinámica para el botón para crear una nueva 'Note'
    let newNoteButton = null;
    if (NOTES_REGEX.test(pathname)) {
        newNoteButton = (
            <button
                className="icon-button"
                title="New Note"
                onClick={onNewNoteClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        );
    }

    // Clase dinámica para el botón para crear un nuevo 'User'
    let newUserButton = null;
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        );
    }

    // Clase dinámica para el botón del 'User'
    let userButton = null;
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            );
        }
    }

    // Clase dinámica para el botón de las 'Notes'
    let notesButton = null;
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesButton = (
            <button
                className="icon-button"
                title="Notes"
                onClick={onNotesClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        );
    }

    // Clase dinámica para el botón para 'deslogearse'
    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    // Clase dinámica en caso de error...
    const errClass = isError ? "errmsg" : "offscreen";

    // Contenido a mostrar dependiendo de si el 'User' está logeado o se está deslogeando...
    let buttonContent;
    if (isLoading) {
        buttonContent = <p>Logging Out...</p>;
    } else {
        buttonContent = (
            <>
                {newNoteButton}
                {newUserButton}
                {notesButton}
                {userButton}
                {logoutButton}
            </>
        );
    }

    return (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">techNotes</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )
}

export default DashHeader;