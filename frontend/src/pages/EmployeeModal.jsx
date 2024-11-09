// EmployeeModal.jsx

import React, { useState } from 'react';
import "../styles/SupplierModal.scss"
import axios from 'axios';

export const EmployeeModal = ({ isOpen, onClose, employee }) => {
  const [updatedEmployee, setUpdatedEmployee] = useState({
    Employee_id: employee.Employee_id,
    Employee_name: employee.Employee_name,
    Phone_no: employee.Phone_no,
    Email: employee.Email,
    Address: employee.Address,
  });

  const [msg, setMsg] = useState([])
  const [err, setError] = useState([])

  const handleInputChange = (e) => {
    setError(null);

    const { name, value, type } = e.target;
    const convertedValue = type === 'number' ? parseFloat(value) : value;
    setUpdatedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: convertedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('Updated Employee:', updatedEmployee);
    try {
      const Employee_id = employee.Employee_id;
      console.log(Employee_id);
      const res = await axios.put("http://localhost:8800/employees/"+Employee_id, updatedEmployee)
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
        <h2>Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="employeeName">
            <span>Employee Name:</span>
            <input required
              type="text"
              id="employeeName"
              name="Employee_name"
              defaultValue={updatedEmployee.Employee_name}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Email:</span>
            <input required
              type="email"
              id="Email"
              name="Email"
              defaultValue={updatedEmployee.Email}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Phone_no:</span>
            <input required
              type="tel"
              id="Phone_no"
              name="Phone_no"
              defaultValue={updatedEmployee.Phone_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Address:</span>
            <input required
              type="tel"
              id="Address"
              name="Address"
              defaultValue={updatedEmployee.Address}
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

export const EmployeeAddModal = ({ isOpen, onClose }) => {
  const [newEmployee, setNewEmployee] = useState({
    Employee_id: '',
    Employee_name: '',
    Phone_no: '',
    Email: '',
    Address: '',
  });
  const [msg, setMsg] = useState([])
  const [err, setError] = useState([])
  const handleInputChange = (e) => {
    setError(null);
    const { name, value, type } = e.target;
    const convertedValue = type === 'number' ? parseFloat(value) : value;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: convertedValue,
    }));
  };

  const handleSubmit = async (e) => {
    setError(null);
    e.preventDefault();
    console.log(newEmployee);
    try {
      const res = await axios.post("http://localhost:8800/employees/add",
                               newEmployee);
      console.log(res)
      console.log('Added Employee:', newEmployee);
      setMsg(res.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Add New Employee</h2>
        <form  onSubmit={handleSubmit}>
          <label className="label" htmlFor="employeeID">
            <span>Employee ID:</span>
            <input required
              type="text"
              id="employeeID"
              name="Employee_id"
              defaultValue={newEmployee.Employee_id}
              onChange={handleInputChange}
            />
          </label>
          <label className="label" htmlFor="employeeName">
            <span>Employee Name:</span>
            <input required
              type="text"
              id="employeeName"
              name="Employee_name"
              defaultValue={newEmployee.Employee_name}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Email:</span>
            <input required
              type="email"
              id="Email"
              name="Email"
              defaultValue={newEmployee.Email}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Phone_no:</span>
            <input required
              type="tel"
              id="Phone_no"
              name="Phone_no"
              defaultValue={newEmployee.Phone_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Address:</span>
            <input required
              type="tel"
              id="Address"
              name="Address"
              defaultValue={newEmployee.Address}
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