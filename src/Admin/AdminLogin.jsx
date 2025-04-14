import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('adminAuth', 'true');
    navigate('/admin');
  };

  return (
    <div className="login-form">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login: <input type="text" defaultValue="admin" readOnly /></label>
        </div>
        <div>
          <label>Password: <input type="password" defaultValue="admin" readOnly /></label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;