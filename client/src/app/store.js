import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

// Creando el 'store'
export const store = configureStore({

    reducer: {
        // Nos referiremos a el reducer que será definido en el apiSlice
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware:
        // Nos referiremos a los middlewares del apiSlice
        getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});