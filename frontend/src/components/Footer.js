import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ИНТЕНСИВ</h3>
          <p>Образовательный центр для детей и подростков</p>
        </div>
        
        <div className="footer-section">
          <h4>Контакты</h4>
          <p>г. Казань, ул. Братьев Батталовых, 20А</p>
          <p>Телефон: +7 (123) 456-78-90</p>
          <p>Email: info@intensiv.ru</p>
        </div>

        <div className="footer-section">
          <h4>Навигация</h4>
          <Link to="/">Главная</Link>
          <Link to="/register">Регистрация</Link>
          <Link to="#courses">Курсы</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ИНТЕНСИВ. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
