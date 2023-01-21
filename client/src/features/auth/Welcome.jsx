import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// Componente funcional
// Representará la sección que se renderizará una vez logeado
const Welcome = () => {

    // Lógica para obtener la fecha actual (en formato internacional)
    const date = new Date();
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date);

    // Utilizando 'useAuth' para manejar las siguientes propiedades (que son decodificadas del token)
    const { username, isManager, isAdmin } = useAuth();

    return (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome {username}!</h1>
            <p><Link to="/dash/notes">View techNotes</Link></p>
            <p><Link to="/dash/notes/new">Add New techNote</Link></p>
            {/* Si el 'User' cumple con alguno de los siguientes roles podrá acceder a estas rutas */}
            {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}
            {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
        </section>
    )
}

export default Welcome;