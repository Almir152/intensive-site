import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    age_min: '',
    age_max: '',
    price: '',
    duration: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          axios.get('/api/admin/users'),
          axios.get('/api/courses')
        ]);
        
        setUsers(usersRes.data);
        setCourses(coursesRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка загрузки данных');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('/api/admin/courses', newCourse);
      const response = await axios.get('/api/courses');
      setCourses(response.data);
      setNewCourse({
        title: '',
        description: '',
        age_min: '',
        age_max: '',
        price: '',
        duration: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при добавлении курса');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-panel">
      <h2>Панель администратора</h2>
      
      <section className="admin-section">
        <h3>Пользователи</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Роль</th>
                <th>Ребенок</th>
                <th>Возраст</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>{user.child_name}</td>
                  <td>{user.child_age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="admin-section">
        <h3>Курсы</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Возраст</th>
                <th>Цена</th>
                <th>Длительность</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.age_min}-{course.age_max}</td>
                  <td>{course.price} руб.</td>
                  <td>{course.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="admin-section">
        <h3>Добавить курс</h3>
        <form onSubmit={handleAddCourse}>
          <div className="form-group">
            <label>Название:</label>
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание:</label>
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Минимальный возраст:</label>
              <input
                type="number"
                min="5"
                max="18"
                value={newCourse.age_min}
                onChange={(e) => setNewCourse({...newCourse, age_min: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Максимальный возраст:</label>
              <input
                type="number"
                min="5"
                max="18"
                value={newCourse.age_max}
                onChange={(e) => setNewCourse({...newCourse, age_max: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Цена (руб):</label>
              <input
                type="number"
                min="0"
                value={newCourse.price}
                onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Длительность:</label>
              <input
                type="text"
                value={newCourse.duration}
                onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="submit-btn">
            Добавить курс
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminPanel;
