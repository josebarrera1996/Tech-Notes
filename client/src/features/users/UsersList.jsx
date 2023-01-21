import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";

// Componente funcional
// Representará la sección donde estará el listado con los usuarios
const UsersList = () => {

  // Utilizando 'useGetUsersQuery'
  const {
    data: users, // 'data' será renombrada como 'users'
    // Lista de estados
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('usersList', {
    // Configuraciones adicionales
    pollingInterval: 60000, // Frecuencia con la que se recargarán los datos (60 segundos / 1 minuto)
    refetchOnFocus: true, // Si estamos en otra 'ventana' y regresamos, se recargarán los datos
    refetchOnMountOrArgChange: true // Si cargamos nuevamente el componente, lo mismo pasará con los datos
  });

  // Renderización en base a ciertas condiciones
  let content;

  if (isLoading) content = <p>Loading...</p> // Si se está a la espera de los datos...

  if (isError) { // Si hay un error...
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) { // Si la carga de datos ha sido exitosa...

    // Traer los 'ids' de los 'users' para acceder a las 'entidades'
    const { ids } = users;

    // Crear el 'cuerpo' de una tabla con la info de cada 'user'
    // Renderizar el componente 'User'
    const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />);

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">Username</th>
            <th scope="col" className="table__th user__roles">Roles</th>
            <th scope="col" className="table__th user__edit">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    );
  }

  return content;
}

export default UsersList;