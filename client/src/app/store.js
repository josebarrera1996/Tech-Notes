import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import authReducer from '../features/auth/authSlice';

// Creando el 'store'
export const store = configureStore({

    reducer: {
        // Nos referiremos a el reducer que será definido en el apiSlice
        [apiSlice.reducerPath]: apiSlice.reducer,
        // Implementando también el 'reducer' del 'authSlice'
        auth: authReducer
    },
    middleware:
        // Nos referiremos a los middlewares del apiSlice
        getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

// Configurando los 'listeners'
// Estos serán de utilidad cuando hay más de un usuario consultando la API a la vez y ver los cambios en los respectivos datos
setupListeners(store.dispatch);