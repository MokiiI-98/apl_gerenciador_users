import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import Home from './components/Home.jsx';
import Cadastrar from './components/Cadastrar.jsx';

import Users from './components/Users.jsx';
import Contato from './components/Contato.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App />}>
          <Route path='home' element={<Home />} /> 
          <Route path="cadastrar" element={<Cadastrar />} /> 
          <Route path='users' element={<Users />} />
          <Route path='contato' element={<Contato />} />
      </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
