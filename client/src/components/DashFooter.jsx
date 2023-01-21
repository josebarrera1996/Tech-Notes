import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

// Componente funcional
// Representará el 'pie' del 'dash'
const DashFooter = () => {

  // Utilizando 'useNavigate' para manejar la navegación
  const navigate = useNavigate();

  // Utilizando 'useLocation' para extraer la propiedad 'pathname' del objeto que representa la ubicación actual
  const { pathname } = useLocation();

  // Utilizando 'useAuth' para manejar las propiedades que nos otorga el token
  const { username, status } = useAuth();

  // Método para navegar a la dirección especificada
  const onGoHomeClicked = () => navigate('/dash');

  // Creando pieza de contenido dependiente
  let goHomeButton = null;

  if (pathname !== '/dash') { // Si no estamos en la página raíz del 'dash'... 
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    )
  }

  return (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  )
}

export default DashFooter;