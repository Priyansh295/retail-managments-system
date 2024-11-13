import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import '../styles/LoginPage.scss';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const [loginType, setLoginType] = useState('client');
  const [err, setError] = useState(null);
  const navigate = useNavigate();
  const { login, login_admin, login_employee, logout, logout_admin } = useContext(AuthContext);

  useEffect(() => {
    logout_admin();
    logout();
  }, [logout_admin, logout]);

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (loginType) {
        case 'client':
          await login({ Client_ID: credentials.id, password: credentials.password });
          navigate("/client");
          break;
        case 'admin':
          await login_admin({ Admin_ID: credentials.id, password: credentials.password });
          navigate("/admin");
          break;
        case 'employee':
          await login_employee({ Employee_ID: credentials.id, password: credentials.password }); // Fixed function call
          navigate("/employee");
          break;
        default:
          setError("Invalid login type");
      }
    } catch (err) {
      setError(err.response?.data || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className={`panel ${loginType === 'client' ? 'active' : ''}`} onClick={() => setLoginType('client')}>
          <h2>Login as Client</h2>
          {loginType === 'client' && (
            <form onSubmit={handleSubmit} className="form">
              <label>
                Client ID:
                <input required type="text" name="id" placeholder="Enter Client ID" onChange={handleChange} />
              </label>
              <label>
                Password:
                <input required type="password" name="password" onChange={handleChange} />
              </label>
              {err && <p className="error-message">{err}</p>}
              <button type="submit">Login</button>
              <p className="register">Don't have an account? <Link to="/register" className="reg-button">Register Now.</Link></p>
            </form>
          )}
        </div>
        <div className={`panel ${loginType === 'admin' ? 'active' : ''}`} onClick={() => setLoginType('admin')}>
          <h2>Login as Admin</h2>
          {loginType === 'admin' && (
            <form onSubmit={handleSubmit} className="form">
              <label>
                Admin ID:
                <input required type="text" name="id" onChange={handleChange} />
              </label>
              <label>
                Password:
                <input required type="password" name="password" onChange={handleChange} />
              </label>
              {err && <p className="error-message">{err}</p>}
              <button type="submit">Login</button>
            </form>
          )}
        </div>
        <div className={`panel ${loginType === 'employee' ? 'active' : ''}`} onClick={() => setLoginType('employee')}>
          <h2>Login as Employee</h2>
          {loginType === 'employee' && (
            <form onSubmit={handleSubmit} className="form">
              <label>
                Employee ID:
                <input required type="text" name="id" onChange={handleChange} />
              </label>
              <label>
                Password:
                <input required type="password" name="password" onChange={handleChange} />
              </label>
              {err && <p className="error-message">{err}</p>}
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
