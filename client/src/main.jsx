import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Implementando la lógica de Redux a la app
import { store } from './app/store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Definiendo la ruta raíz*/}
          <Route path='/*' element={<App />} /> {/* Esta ruta permitirá alojar otras rutas */}
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
