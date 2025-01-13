import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RegisterForm from './pages/RegisterForm'; // Página de registro
import HomePage from './pages/HomePage.jsx'; // Página principal
import RecepcionForm from './pages/RecepcionForm'; // Página de Recepción

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <nav className="navbar">
            <ul className="menu">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/register">Registrarse</Link></li>
              <li><Link to="/recepcion">Recepción</Link></li> {/* Nueva ruta a Recepción */}
              <li><a href="#trilla">Trilla</a></li>
              <li><a href="#lavado">Lavado</a></li>
              <li><a href="#tratamiento">Tratamiento</a></li>
              <li><a href="#centrifugado">Centrifugado</a></li>
              <li><a href="#secado">Secado</a></li>
              <li><a href="#envasado">Envasado</a></li>
              <li><a href="#limpieza">Limpieza</a></li>
              <li><a href="#pesado">Pesado</a></li>
            </ul>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/recepcion" element={<RecepcionForm />} /> {/* Nueva ruta */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
