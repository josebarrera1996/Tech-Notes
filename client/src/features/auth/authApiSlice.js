import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

// Creando este slice para poder definir 'endpoints' e interactuar con la lógica del servidor
export const authApiSlice = apiSlice.injectEndpoints({
    // Definiendo los 'endpoints'
    endpoints: builder => ({
        // Método para poder 'logearnos'
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials } // 'username' & 'password'
            })
        }),
        // Método para poder 'deslogearnos'
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // Implementando este método dentro de este 'endpoint'
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    // Esperando que la query haya sido completada...
                    const { data } = await queryFulfilled;
                    console.log(data);
                    // Realizar el deslogeo
                    dispatch(logOut());
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState()); // Limpiar el estado de la api
                    }, 1000);
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        // Método para realizar un 'refresh' para generar un nuevo token de acceso
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            // Implementando este método dentro de este 'endpoint'
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    // Esperando que la query haya sido completada...
                    const { data } = await queryFulfilled;
                    console.log(data);
                    // Accediendo al token de acceso
                    const { accessToken } = data;
                    // Estableciendo las credenciales con el token de acceso
                    dispatch(setCredentials({ accessToken }));
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
});

// Exportando los hooks personalizados, estas 'mutations'
export const {
    useLoginMutation, // Referencia a 'login'
    useSendLogoutMutation, // Referencia a 'sendLogout'
    useRefreshMutation, // Referencia a 'refresh'
} = authApiSlice;