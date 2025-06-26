import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">ИНТЕНСИВ</Link>
          <p className="logo-sub">Образовательный центр</p>
        </div>

        <button 
          className={`menu-button ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Главная</Link>
          <Link to="/register" onClick={() => setIsMenuOpen(false)}>Регистрация</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Админ-панель</Link>
              )}
              <button className="logout-btn" onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Войти</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
