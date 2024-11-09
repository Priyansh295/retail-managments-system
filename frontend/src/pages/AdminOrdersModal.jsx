import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const ViewModal = ({ isOpen, onClose, Order }) => {
  const [Orders, setOrders] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    console.log(Order)
    fetchOrder_line();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:8800/employees');
      // console.log(res.data);
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrder_line = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/order_line/${Order.Order_ID}`);
      // console.log('Response:', res.data);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(employee);
    try {
      const res = await axios.put(`http://localhost:8800/orders/employee/${Order.Order_ID}`, [employee]);
      console.log(res);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setEmployee(e.target.value);
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <div className='order_line_container'>
          <h1>Order Lines</h1>
          <div className="order_line-table">
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Status</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {Orders.map((order) => (
                  <tr className="order_line_row" key={order.Order_id}>
                    <td>{order.Product_ID}</td>
                    <td>{order.Status}</td>
                    <td>{order.Quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='Employee'>
            <div className='Assigned-Employee'>
            {Order.Employee_ID && <span>Assigned Employee: </span>}
            {Order.Employee_ID && <span>{Order.Employee_ID}</span>}
            </div>
            {!Order.Employee_ID && (
              <form onSubmit={handleSubmit}>
                <label className="label">
                  <span>Employee ID:</span>
                  <select
                    required
                    name="Employee_ID"
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Employee
                    </option>
                    {employees.map((employee) => (
                      <option key={employee.Employee_id} value={employee.Employee_id}>
                        {employee.Employee_id}
                      </option>
                    ))}
                  </select>
                </label>
                <button type='submit'>Add Employee</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
