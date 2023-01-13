import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

// Con esto podremos generar un conjunto de 'reducers' y 'selectors' pre-construidos para realizar operaciones CRUD
// en una 'estructura de estado normalizada' que contiene instancias de un tipo particular de objetos de datos
const notesAdapter = createEntityAdapter({}); 

// Obteniendo y definiendo el estado inicial
const initialState = notesAdapter.getInitialState({
    // Realizar un ordenamiento para situar a las 'notes' que tengan el estado 'Open' primero
    // Esto queire decir que las que tengan 'completed' irán al final
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
});

// Creando el 'slice' para la api que trabaja con los 'notes'
export const notesApiSlice = apiSlice.injectEndpoints({

    // Definiendo los 'endpoints' de la api
    endpoints: builder => ({
        // Para traer los usuarios...
        getNotes: builder.query({
            query: () => '/notes',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedNotes = responseData.map(note => {
                    // Como trabajamos con MongoDB, la propiedad es '_id'
                    note.id = note._doc._id; // note.id = note._id;
                    return note;
                });
                // Retornar el estado inicial de este slice con los usuarios obtenidos
                return notesAdapter.setAll(initialState, loadedNotes)
            },
            providesTags: (result, error, arg) => {
                // Chequear si existe en el resultado obtenido la propiedad 'ids'
                if (result?.ids) { // Si la hay, retornar la lista de usuarios
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST' }] // En caso de que haya habido una falla...
            }
        }),
    }),
});

// Exportando el Hook personalizado recien creado
export const {
    useGetNotesQuery // Referencia a 'getNotes'
} = notesApiSlice;

// Retorna el objeto de resultado de la consulta (query)
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// Crea el selector memorizado
const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data // Objeto de estado normalizado con ids y entidades
);

// getSelectors crea estos selectores y los renombramos con alias usando desestructuración
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
    // Pasar un selector que devuelve el 'slice' de estado de los usuarios
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState);






