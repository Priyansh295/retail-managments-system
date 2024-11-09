import React, { useState, useContext } from 'react';
import "../styles/SupplierModal.scss"
import axios from 'axios';
import { AuthContext } from '../context/authContext';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState(null);
    const [err, setError] = useState(null);
    const { admin } = useContext(AuthContext);
  
    const handleInputChange = (e) => {
      setError(null);
      const { name, value } = e.target;
      if (name === 'currentPassword') {
        setCurrentPassword(value);
      } else if (name === 'newPassword') {
        setNewPassword(value);
      } else if (name === 'confirmPassword') {
        setConfirmPassword(value);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
  
      if (newPassword !== confirmPassword) {
        setError("New password and confirm password don't match.");
        return;
      }
  
      try {
        const res = await axios.post("http://localhost:8800/admin/change-password", {
          admin_id: admin.Admin_ID,
          currentPassword,
          newPassword,
        });
        console.log(res.data)
        setMsg(res.data);
      } catch (err) {
        setError(err.message);
      }
    };
  
    return (
      <div className={`modal ${isOpen ? 'open' : ''}`} id="passwordModalContainer">
        <div className="modal-content">
          <span className="close-btn" onClick={onClose}>&times;</span>
          <h2>Change Password</h2>
          <form onSubmit={handleSubmit}>
            <label className="label" htmlFor="currentPassword">
              <span>Current Password:</span>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="label" htmlFor="newPassword">
              <span>New Password:</span>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="label" htmlFor="confirmPassword">
              <span>Confirm Password:</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                required
              />
            </label>
            {msg && <p>{JSON.stringify(msg)}</p>}
            {err && <p>{JSON.stringify(err)}</p>}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  };

export const AddAdminModal = ({ isOpen, onClose}) => {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name === 'adminId') {
        setAdminId(value);
      } else if (name === 'password') {
        setPassword(value);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Make a request to your backend to add a new admin
        const res = await axios.post('http://localhost:8800/admin/add', {
          adminId,
          password,
        });
        setMsg(res.data)
      } catch (error) {
        console.error('Error adding admin:', error);
      }
    };
  
    return (
      <div className={`modal ${isOpen ? 'open' : ''}`} id="addAdminModalContainer">
        <div className="modal-content">
          <span className="close-btn" onClick={onClose}>&times;</span>
          <h2>Add Admin</h2>
          <form onSubmit={handleSubmit}>
            <label className="label" htmlFor="adminId">
              <span>Admin ID:</span>
              <input
                type="text"
                id="adminId"
                name="adminId"
                value={adminId}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="label" htmlFor="password">
              <span>Password:</span>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                required
              />
            </label>
            {msg && <p>{JSON.stringify(msg)}</p>}
            <button type="submit">Add Admin</button>
          </form>
        </div>
      </div>
    );
  };