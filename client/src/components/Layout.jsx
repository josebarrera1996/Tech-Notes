import { Outlet } from "react-router-dom";

// Componente funcional
// Será el componente 'padre' y permitirá renderizar elementos de la rutas secundarias (si las hay)
const Layout = () => {

  return <Outlet />
}

export default Layout;