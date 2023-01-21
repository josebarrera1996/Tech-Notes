import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode';

// Componente funcional
// Servirá como un Hook personalizado para poder obtener los roles de el 'User' logeado
const useAuth = () => {
    // Utilizando 'useSelector' para obtener el token actual
    const token = useSelector(selectCurrentToken);

    let isManager = false;
    let isAdmin = false;
    let status = "Employee";

    // Si existe el token...
    if (token) { 
        // Decodificar el token...
        const decoded = jwtDecode(token);
        // Obtener las siguientes propiedades del mismo...
        const { username, roles } = decoded.UserInfo;
        // Verificar si el 'User' cumple con los siguientes roles
        isManager = roles.includes('Manager');
        isAdmin = roles.includes('Admin');
        // Actualizando el 'status'
        if (isManager) status = "Manager";
        if (isAdmin) status = "Admin";

        return { username, roles, status, isManager, isAdmin };
    }
    // En caso de que no exista el token...
    return { username: '', roles: [], isManager, isAdmin, status };
}
export default useAuth;