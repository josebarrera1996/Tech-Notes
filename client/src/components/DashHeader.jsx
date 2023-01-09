import { Link } from "react-router-dom";

// Componente funcional
// Representará el 'encabezado' del dash
const DashHeader = () => {

    return (
        <header className="dash-header">
            <div className="dash-header__container">
                <Link to="/dash">
                    <h1 className="dash-header__title">techNotes</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* add nav buttons later */}
                </nav>
            </div>
        </header>
    )
}

export default DashHeader;