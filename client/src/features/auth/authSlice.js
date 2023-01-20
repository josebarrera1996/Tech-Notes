import { createSlice } from '@reduxjs/toolkit';

// Creando el 'slice' para lo que es la autenticación con REDUX
const authSlice = createSlice({
    // Propiedades
    name: 'auth', // Nombre del 'slice'
    initialState: { token: null }, // Es el 'token' que recibiremos de nuestra API
    reducers: {
        /* Definición de los 'reducers' */
        setCredentials: (state, action) => { // Método para establecer las credenciales como autenticado
            const { accessToken } = action.payload;
            state.token = accessToken; // Asignaremos el token de acceso
        },
        logOut: (state, action) => { // Método para poder deslogearnos y resetear el token
            state.token = null;
        }
    }
});

// Exportando los reducers como 'acciones'
export const { setCredentials, logOut } = authSlice.actions;
// Exportando todos los 'reducers' para poder añadirlos al 'store'
export default authSlice.reducer;
// Creando un 'selector' personalizado para seleccionar el token actual
export const selectCurrentToken = (state) => state.auth.token;