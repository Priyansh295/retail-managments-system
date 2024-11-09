import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import '../styles/Employees.scss';
import {EmployeeModal, EmployeeAddModal} from './EmployeeModal';

const Employees = () => {
  const { admin } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // New state for the add modal

  useEffect(() => {
    fetchEmployees();
  }, []);
  const [err, setError] = useState([])
  const [msg, setMsg] = useState([])
  const fetchEmployees = async () => {
    try {
        console.log("here")
        const res = await axios.get(`http://localhost:8800/employees`);
        console.log(res)
        setEmployees(res.data);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
  };

  const handleAdd = () => {
    setMsg(null)
    setIsAddModalOpen(true);
  };

  const handleDelete = async (employee) => {
    try {
      const Employee_id = employee.Employee_id;
      console.log(Employee_id);
      const res = await axios.delete("http://localhost:8800/employees/"+Employee_id)
      console.log(res)
      fetchEmployees();
      setMsg(res.data)
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
  };

  const openUpdateModal = (employee) => {
    setMsg(null)
    setSelectedEmployee(employee);
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsUpdateModalOpen(false);
    setIsAddModalOpen(false); // Close the add modal
    fetchEmployees();
  };

  if (admin) {
    return (
      <div className='employee_container'>
        <h1>Employees</h1>
        <div className="employee-table">
          <button className="add-button" onClick={handleAdd}>
            Add Employee
          </button>
          {err && <p> {err}</p>}
          {msg && <p> {msg}</p>}
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Phone No.</th>
                <th>Email</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr className="employee_row" key={employee.Employee_id}>
                  <td>{employee.Employee_id}</td>
                  <td>{employee.Employee_name}</td>
                  <td>{employee.Phone_no}</td>
                  <td>{employee.Email}</td>
                  <td>{employee.Address}</td>
                  <td className='employee-buttons'>
                    <button className="update-button" onClick={() => openUpdateModal(employee)}>
                      Update
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(employee)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Conditionally render the modals */}
          {isUpdateModalOpen && (
            <EmployeeModal isOpen={isUpdateModalOpen} onClose={closeModal} employee={selectedEmployee} />
          )}
          {isAddModalOpen && (
            <EmployeeAddModal isOpen={isAddModalOpen} onClose={closeModal} />
          )}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Employees
