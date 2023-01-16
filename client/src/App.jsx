import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./features/auth/Public";
import Login from "./components/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import EditNote from './features/notes/EditNote';
import NewNote from './features/notes/NewNote';
import Prefetch from "./features/auth/Prefetch";

// Componente funcional
// En este se definirán las rutas
function App() {

  return (
    <Routes>
      {/* Definiendo la ruta con el elemento que se renderizará en la gran mayoría de los componentes */}
      <Route path="/" element={<Layout />}>
        {/* Definiendo las rutas secundarias (y públicas) */}
        <Route index element={<Public />} /> {/* Este será el componente por defecto que se mostrará al acceder a la app */}
        <Route path="login" element={<Login />} />
        {/* Definiendo rutas protegidas (no son de acceso público y solo aparecerán una vez logeados) */}
        <Route element={<Prefetch />}> {/* Implementando la lógica del respectivo componente para mantener las subscripciones */}
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} /> {/* Este será el componente por defecto que se mostrará al acceder a esta ruta*/}
            <Route path="users"> {/* /dash/users */}
              <Route index element={<UsersList />} /> {/* Este será el componente por defecto que se mostrará al acceder a esta ruta*/}
              <Route path=":id" element={<EditUser />} />
              <Route path="new" element={<NewUserForm />} />
            </Route>
            <Route path="notes"> {/* /dash/notes */}
              <Route index element={<NotesList />} /> {/* Este será el componente por defecto que se mostrará al acceder a esta ruta*/}
              <Route path=":id" element={<EditNote />} />
              <Route path="new" element={<NewNote />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App;
