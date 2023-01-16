import { Link } from 'react-router-dom';

// Componente funcional
// Representará la sección que se renderizará una vez logeado
const Welcome = () => {

    // Lógica para obtener la fecha actual (en formato internacional)
    const date = new Date();
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date);

    return (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome!</h1>
            <p><Link to="/dash/notes">View techNotes</Link></p>
            <p><Link to="/dash/notes/new">Add New techNote</Link></p>
            <p><Link to="/dash/users">View User Settings</Link></p>
            <p><Link to="/dash/users/new">Add New User</Link></p>
        </section>
    )
}

export default Welcome;