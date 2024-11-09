import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import '../styles/SupplierOrders.scss';
import CountdownTimer from './CountdownTimer';

const SupplierOrders = () => {
  const { admin } = useContext(AuthContext);
  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/supplier-orders`);
      console.log('Response from backend:', res.data);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleClick = async (order) => {
    console.log(order)
    try {
      const res = await axios.put(`http://localhost:8800/supplier-orders/update-status/`+order.Supplier_ID, ['Complete', order.date_time]);
      console.log(res);
      fetchOrders();
    } catch (error) {
      console.error('Error Updating Status:', error);
    }
  }

  if (admin) {
    return (
      <div className='supplier_orders_container'>
        <h1>Supplier Orders</h1>
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Timestamp</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Time Remaining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Orders.map((order) => (
                <tr className="order_row" key={order.Order_id}>
                  <td>{order.Supplier_ID}</td>
                  <td>{order.date_time}</td>
                  <td>{order.Quantity}</td>
                  <td>{order.Status}</td>
                  <td className='time-remaining'>
                      {order.Status !== 'Complete' ?
                      (<CountdownTimer endTime={new Date(order.res_time).getTime()} />) :
                      '-'
                      }
                  </td>
                  <td className='order-buttons'>
                    <button
                      className="status-button"
                      disabled={order.Status !== 'Complete' || new Date(order.res_time).getTime() > new Date().getTime()}
                      onClick={ () => handleClick(order)}
                    >
                      Add To Storage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default SupplierOrders;
