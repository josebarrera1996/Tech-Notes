import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUserById } from './usersApiSlice';

// Componente funcional
// Representará la estructura de un 'User'
const User = ({ userId }) => { // Propiedad destructurada 'userId'

    // Utilizando 'useSelector' para acceder con 'selectUserById'
    // Para obtener los datos del 'User'
    const user = useSelector(state => selectUserById(state, userId));

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();

    if (user) { // Si el 'User' existe...

        // Dirección para poder editar a el 'User'
        const handleEdit = () => navigate(`/dash/users/${userId}`);
        // Concatenar los roles del 'User'
        const userRolesString = user.roles.toString().replaceAll(',', ', ')
        // Clase a aplicar si el 'User' está o no activo
        const cellStatus = user.active ? '' : 'table__cell--inactive';

        return (
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
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

}

export default User;