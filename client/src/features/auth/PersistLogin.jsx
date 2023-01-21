import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "./authSlice";

// Componente funcional
// Será muy útil porque nos permitirá mantenernos logeados aún cuando refresquemos la aplicación
const PersistLogin = () => {

    // Utilizando 'usePersist'
    const [persist] = usePersist();
    // Utilizando 'useSelector' para selector el token actual
    const token = useSelector(selectCurrentToken);
    // Utilizando 'useRef'
    const effectRan = useRef(false);
    // Utilizando 'useState' para manejar el estado de éxito
    const [trueSuccess, setTrueSuccess] = useState(false);
    // Utilizando el Hook personalizado de Redux
    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

    // Utilizando 'useEffect' para mantener el login 
    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token');
                try {
                    //const response = 
                    await refresh();
                    //const { accessToken } = response.data
                    setTrueSuccess(true);
                }
                catch (err) {
                    console.error(err);
                }
            }
            if (!token && persist) verifyRefreshToken();
        }
        return () => effectRan.current = true;
        // eslint-disable-next-line
    }, []);

    let content;
    if (!persist) { // persist: no
        console.log('no persist');
        content = <Outlet />;
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>;
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {error.data?.message}
                <Link to="/login">Please login again</Link>.
            </p>
        );
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success');
        content = <Outlet />;
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit');
        console.log(isUninitialized);
        content = <Outlet />;
    }
    return content;
}
export default PersistLogin;