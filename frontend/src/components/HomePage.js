import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Добро пожаловать в ИНТЕНСИВ</h1>
          <p>Лучшие образовательные программы для вашего ребенка</p>
          <Link to="/register" className="cta-button">Записаться на курс</Link>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Квалифицированные преподаватели</h3>
          <p>Опытные педагоги с авторскими методиками</p>
        </div>
        <div className="feature-card">
          <h3>Современные программы</h3>
          <p>Актуальные знания и практические навыки</p>
        </div>
        <div className="feature-card">
          <h3>Индивидуальный подход</h3>
          <p>Занятия в мини-группах до 8 человек</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
