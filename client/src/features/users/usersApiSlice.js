import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

// Con esto podremos generar un conjunto de 'reducers' y 'selectors' pre-construidos para realizar operaciones CRUD
// en una 'estructura de estado normalizada' que contiene instancias de un tipo particular de objetos de datos
const usersAdapter = createEntityAdapter({});

// Obteniendo y definiendo el estado inicial
const initialState = usersAdapter.getInitialState();

// Creando el 'slice' para la api que trabaja con los 'users'
export const usersApiSlice = apiSlice.injectEndpoints({

    // Definiendo los 'endpoints' de la api
    endpoints: builder => ({
        // Para traer los usuarios...
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError; // Trabajando con la propiedad 'isError' definida en el servidor
                },
            }),
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    // Como trabajamos con MongoDB, la propiedad es '_id'
                    user.id = user._id;
                    return user;
                });
                // Retornar el estado inicial de este slice con los usuarios obtenidos
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                // Chequear si existe en el resultado obtenido la propiedad 'ids'
                if (result?.ids) { // Si la hay, retornar la lista de usuarios
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }] // En caso de que haya habido una falla...
            }
        }),
        // Para añadir un nuevo usuario...
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [
                // Forzando a el 'cache' a actualizarlo para que se invalide la 'LIST' del 'User'
                { type: 'User', id: "LIST" }
            ]
        }),
        // Para actualizar a un usuario existente...
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                // Forzando a el 'cache' a actualizarlo para que se invalide el 'id' del 'User' que se le pase
                { type: 'User', id: arg.id }
            ]
        }),
        // Para eliminar a un usuario existente...
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                // Forzando a el 'cache' a actualizarlo para que se invalide el 'id' del 'User' que se le pase
                { type: 'User', id: arg.id }
            ]
        })
    }),
});

// Exportando los hooks personalizados
export const {
    useGetUsersQuery, // Referencia a 'getUsers'
    // Mutaciones
    useAddNewUserMutation, // Referencia a 'addNewUser'
    useUpdateUserMutation, // Referencia a 'updateUser'
    useDeleteUserMutation // Referencia a 'deleteUser'
} = usersApiSlice;

// Retorna el objeto de resultado de la consulta (query)
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// Crea el selector memorizado
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // Objeto de estado normalizado con ids y entidades
);

// getSelectors crea estos selectores y los renombramos con alias usando desestructuración
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pasar un selector que devuelve el 'slice' de estado de los usuarios
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState);






