  import React, { useContext, useEffect, useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { AuthContext } from '../context/authContext';
  import '../styles/LoginPage.scss';

  const LoginPage = () => {
    const [credentials, setCredentials] = useState({ id: "", password: "" });
    const [isClient, setIsClient] = useState(true);
    const [err, setError] = useState(null);
    const navigate = useNavigate();
    const { login, login_admin, logout, logout_admin } = useContext(AuthContext);

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
        if (isClient) {
          await login({ Client_ID: credentials.id, password: credentials.password });
          navigate("/client");
        } else {
          await login_admin({ Admin_ID: credentials.id, password: credentials.password });
          navigate("/admin");
        }
      } catch (err) {
        setError(err.response?.data || "An error occurred");
      }
    };

    return (
      <div className="login-container">
        <div className="login-box">
          <div className={`panel ${isClient ? 'active' : ''}`} onClick={() => setIsClient(true)}>
            <h2>Login as Client</h2>
            {isClient && (
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
          <div className={`panel ${!isClient ? 'active' : ''}`} onClick={() => setIsClient(false)}>
            <h2>Login as Admin</h2>
            {!isClient && (
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
        </div>
      </div>
    );
  };

  export default LoginPage;
