import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    childName: '',
    childAge: ''
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (err) {
        setServerError(err.response?.data?.error || 'Ошибка загрузки курсов');
      }
    };
    
    fetchCourses();
  }, []);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Введите ваше имя';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Введите корректный email';
    if (!formData.phone.match(/^\+?[0-9]{10,15}$/)) newErrors.phone = 'Введите корректный телефон';
    if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!formData.childName.trim()) newErrors.childName = 'Введите имя ребенка';
    if (!formData.childAge || formData.childAge < 5 || formData.childAge > 18) newErrors.childAge = 'Возраст должен быть от 5 до 18 лет';
    if (!selectedCourse) newErrors.course = 'Выберите курс';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const result = await register({
        ...formData,
        course: selectedCourse
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setServerError(result.error);
      }
    } catch (err) {
      setServerError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <h2>Регистрация в ИНТЕНСИВ</h2>
      {serverError && <div className="error-message">{serverError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ваше имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Телефон:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
            placeholder="+79991234567"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Подтвердите пароль:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Имя ребенка:</label>
            <input
              type="text"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
              className={errors.childName ? 'error' : ''}
            />
            {errors.childName && <span className="error-text">{errors.childName}</span>}
          </div>

          <div className="form-group">
            <label>Возраст ребенка:</label>
            <input
              type="number"
              name="childAge"
              min="5"
              max="18"
              value={formData.childAge}
              onChange={handleChange}
              className={errors.childAge ? 'error' : ''}
            />
            {errors.childAge && <span className="error-text">{errors.childAge}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Выберите курс:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={errors.course ? 'error' : ''}
          >
            <option value="">-- Выберите курс --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title} ({course.age_min}-{course.age_max} лет)
              </option>
            ))}
          </select>
          {errors.course && <span className="error-text">{errors.course}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
