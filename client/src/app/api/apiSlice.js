import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    // Especificando el endpoint del servidor
    baseUrl: 'http://localhost:3500',
    credentials: 'include', 
    // Prepara los 'headers'
    prepareHeaders: (headers, { getState }) => {
        // Obtener el estado actual del token
        const token = getState().auth.token;
        if (token) {
            // Si tenemos el token en los 'headers' establecerlo
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions);

    // Si lo deseas, puedes manejar otros códigos de estados...
    if (result?.error?.status === 403) {
        console.log('sending refresh token');
        // Enviar token de 'refresh' para obtener un nuevo 'token de acceso'
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        if (refreshResult?.data) {
            // Almacenar el nuevo token
            api.dispatch(setCredentials({ ...refreshResult.data }));
            // Vuelva a intentar la consulta original con un nuevo token de acceso
            result = await baseQuery(args, api, extraOptions);
        } else {
            if (refreshResult?.error?.status === 403) {
                // En caso de expiración...
                refreshResult.error.data.message = "Your login has expired.";
            }
            return refreshResult;
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'], // Para el manejo del cache
    endpoints: builder => ({})
})


