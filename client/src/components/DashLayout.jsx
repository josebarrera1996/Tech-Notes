import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

// Componente funcional
// Luego de que el usuario se haya logeado, tendrá acceso a esta parte del 'dash'.
const DashLayout = () => {

    return (
        <>
            <DashHeader />
            <div className="dash-container">
                {/* Todos los elementos que se encuentren dentro tedrán estas 2 partes del 'dash' */}
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}

export default DashLayout;