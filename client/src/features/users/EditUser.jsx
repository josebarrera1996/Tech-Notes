import { useParams } from 'react-router-dom';
import { useGetUsersQuery } from './usersApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import EditUserForm from './EditUserForm';
import useTitle from '../../hooks/useTitle';

// Componente funcional
// Servirá de 'contenedor' del formulario para editar al 'User'
const EditUser = () => {

  // Utilizando 'useTitle' para asignar el respectito título
  useTitle('techNotes: Edit User');

  // Utilizando 'useParams' 
  const { id } = useParams(); // Obteniendo el 'id' de los parámetros de la URL

  // Utilizando 'useGetUsersQuery' para llenar este componente con los datos de la 'Note' que coincida
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id]
    })
  });

  // Si no hay 'User' mostrar el siguiente componente
  if (!user) return <PulseLoader color={"#FFF"} />

  // Si hay 'User'...
  const content = <EditUserForm user={user} />

  return content;
}

export default EditUser;