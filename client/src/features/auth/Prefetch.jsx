import { store } from '../../app/store';
import { notesApiSlice } from '../notes/notesApiSlice';
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Componente funcional
// Servirá para 'mantener' las 'subscripciones' y evitar que el estado de las 'notes' y los 'users' desaparezcan después de ciertos segundos
// Incluso si refrescamos las páginas, al igual que cuando se abandonen estas rutas 'protegidas' se procederá a 'desuscribir'
const Prefetch = () => {

    // Utilizando 'useEffect'¿
    useEffect(() => {
        console.log('subscribing');
        // Subscripción manual para las 'notes' para que mantengan activas al especificiar la respectiva 'query'
        store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true }));
        // Subscripción manual para los 'users' para que se mantengan activas al especificar la respectiva 'query'
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }));
    }, []); // Arreglo de dependencia vacío (para que se renderice solo cuando se monte este componente)

    // Mantendrá todo esto en los componentes que se encuentren dentro del mismo
    return <Outlet />;
}

export default Prefetch;