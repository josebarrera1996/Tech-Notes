import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }), // Especificando el endpoint del servidor
    tagTypes: ['Note', 'User'], // Para el manejo del cache
    // Se proveerán 'slices' extendidos que adjuntaremos en este segmento del 'apiSlice'
    endpoints: builder => ({})
});