import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserById } from './usersApiSlice';
import EditUserForm from './EditUserForm';

// Componente funcional
// Servirá de 'contenedor' del formulario para editar al 'User'
const EditUser = () => {

  // Utilizando 'useParams' 
  const { id } = useParams(); // Obteniendo el 'id' de los parámetros de la URL

  // Utilizando 'useSelector' con el Hook 'selectUserById' para obtener el estado del respectivo 'User' (gracias a el ID)
  const user = useSelector(state => selectUserById(state, id));

  // Constante cuyo contenido dependerá de si el 'User' ha sido cargado o se está en el proceso..
  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

  return content;
}

export default EditUser;