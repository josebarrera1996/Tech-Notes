import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "./authSlice";

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
            // Implementando este método dentro de este 'endppint'
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    //const { data } = await queryFulfilled; // Obtenemos el mensaje de éxito del servidor
                    await queryFulfilled; // Una vez que la 'query' ha sido completada...
                    //console.log(data); //  Nos mostraría el mensaje (de éxito) definido en el servidor
                    dispatch(logOut()); // Reazliar el dispatch a el 'reducer' de 'logOut'
                    dispatch(apiSlice.util.resetApiState()); // Restear el 'state' del 'apiSlice' y con ello el 'cache' y las 'subscriptions'
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
            })
        }),
    })
});

// Exportando los hooks personalizados, estas 'mutations'
export const {
    useLoginMutation, // Referencia a 'login'
    useSendLogoutMutation, // Referencia a 'sendLogout'
    useRefreshMutation, // Referencia a 'refresh'
} = authApiSlice;