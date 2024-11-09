// OrdersComponent.js

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import '../styles/OrderComponent.scss';

const OrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState(''); // State to store the selected status
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/products/orders/${currentUser.Client_ID}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [currentUser.Client_ID]); // Add currentUser.Client_ID as a dependency

  const showOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:8800/order-details/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const hideOrderDetails = () => {
    setSelectedOrder(null);
  };

  const filterOrders = (status) => {
    setFilterStatus(status);
  };

  const filteredOrders = filterStatus ? orders.filter(order => order.Status === filterStatus) : orders;

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      <div className="order-history-buttons">
        <div className="filter-status">
          <label htmlFor="statusFilter">Filter by Status</label>
          <select
            id="statusFilter"
            onChange={(e) => filterOrders(e.target.value)}
            value={filterStatus}
          >
            <option value="">All</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
            <option value="Shipped">Shipped</option>
          </select>
        </div>
      </div>
      <ul>
        {filteredOrders.map((order) => (
          <li key={order.Order_ID} className="order-item">
            <div className="order-info">
              <p>Order ID: {order.Order_ID}</p>
              <p>Status: {order.Status}</p>
              <p>Total Price: ${order.Total_Payment}</p>
              {order.Employee_ID && (<p>Employee ID : {order.Employee_ID}</p>)}
            </div>
            <div className="order-buttons">
              <button onClick={() => showOrderDetails(order.Order_ID)}>Show Details</button>
              <button onClick={hideOrderDetails}>Hide Details</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <div className="order-details">
          <h2>Order Details</h2>
          <p>Order ID: {selectedOrder[0].orderLine.Order_ID}</p>
          <ul>
            {selectedOrder.map((item) => (
              <li key={item.product.Product_ID}>
                Product Name: {item.product[0].Product_Name}, Quantity: {item.orderLine.Quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrdersComponent;

