import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Componente funcional
// Servirá para poder proteger las rutas de los User's que no cumplan con los respectivos roles
const RequireAuth = ({ allowedRoles }) => {

    // Utilizando 'useLocation'
    const location = useLocation();
    // Utilizando 'useAuth' para manejar las propiedades del token decodificado
    const { roles } = useAuth();

    const content = (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet /> /* True: Mostrar los componentes que se encuentren dentro de este */
            // False: nos mandará a 'login' pero no nos deslogeará (podemos dar click en volver y lo constataremos)
            : <Navigate to="/login" state={{ from: location }} replace />
    );

    return content;
}
export default RequireAuth;