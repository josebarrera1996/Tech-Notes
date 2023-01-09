import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Definiendo la ruta raíz*/}
        <Route path='/*' element={<App />} /> {/* Esta ruta permitirá alojar otras rutas */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
