import React, { useState, useContext } from 'react';
import "../styles/SupplierModal.scss"
import axios from 'axios';
import { AuthContext } from '../context/authContext';

export const ClientModal = ({ isOpen, onClose, client }) => {
    console.log("Modal",client)
  const [updatedClient, setUpdatedClient] = useState({
    Client_ID: client.Client_ID,
    Client_name: client.Client_Name,
    Phone_no: client.phone_no,
    Email: client.Email,
    City: client.City,
    Pincode: client.PINCODE,
    Building: client.Building,
    Floor_no: client.Floor_no
  });

  const [msg, setMsg] = useState([])
  const [err, setError] = useState([])

  const handleInputChange = (e) => {
    setError(null);

    const { name, value, type } = e.target;
    const convertedValue = type === 'number' ? parseFloat(value) : value;
    setUpdatedClient((prevEmployee) => ({
      ...prevEmployee,
      [name]: convertedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('Updated Client:', updatedClient);
    try {
      const client_id = client.Client_ID;
      console.log(client_id);
      console.log("Hello",updatedClient)
      const res = await axios.put("http://localhost:8800/client/update/"+client_id, updatedClient)
      console.log(res)
      setMsg(res.data)
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Edit Client</h2>
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="employeeName">
            <span>Client Name:</span>
            <input required
              type="text"
              id="clientName"
              name="Client_name"
              defaultValue={updatedClient.Client_name}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Email:</span>
            <input required
              type="email"
              id="Email"
              name="Email"
              defaultValue={updatedClient.Email}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Phone_no:</span>
            <input required
              type="tel"
              id="Phone_no"
              name="Phone_no"
              defaultValue={updatedClient.Phone_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>City:</span>
            <input required
              type="text"
              id="city"
              name="City"
              defaultValue={updatedClient.City}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Pincode:</span>
            <input required
              type="text"
              id="pincode"
              name="Pincode"
              defaultValue={updatedClient.Pincode}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Building:</span>
            <input required
              type="text"
              id="building"
              name="Building"
              defaultValue={updatedClient.Building}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Floor No:</span>
            <input required
              type="text"
              id="floor"
              name="Floor_no"
              defaultValue={updatedClient.Floor_no}
              onChange={handleInputChange}
            />
          </label>
          {msg && <p> {msg}</p>}
          {err && <p> {err}</p>}
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState(null);
    const [err, setError] = useState(null);
    const { currentUser } = useContext(AuthContext);
  
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
        const res = await axios.post("http://localhost:8800/client/change-password", {
          client_id: currentUser.Client_ID,
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
            {msg && <p> {JSON.stringify(msg)}</p>}
            {err && <p>{JSON.stringify(err)}</p>}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  };