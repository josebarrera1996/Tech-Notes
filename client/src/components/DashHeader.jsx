import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
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

    // En caso de que se esté cargando...
    if (isLoading) return <p>Logging Out...</p>
    // En caso de obtener un error...
    if (isError) return <p>Error: {error.data?.message}</p>

    // Clases dinámicas dependiendo de si se cumplen o no los REGEX
    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    // Botón para poder deslogearse
    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    return (
        <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
                <Link to="/dash">
                    <h1 className="dash-header__title">techNotes</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* add more buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )
}

export default DashHeader;