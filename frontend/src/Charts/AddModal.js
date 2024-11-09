// ShowModal.jsx
import { useTable } from 'react-table';
import React from 'react';
import '../styles/BarModal.scss';
export const ShowModal = ({ isOpen, onClose, categoryDetails }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Show Details</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Products Sold</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {categoryDetails.map((category, index) => (
              <tr key={index}>
                <td>{category.Category}</td>
                <td>{category.ProductsSold}</td>
                {/* Add more cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ShowClientModal = ({ isOpen, onClose, categoryDetails }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Show Details</h2>
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Total Orders</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {categoryDetails.map((client) => (
                <tr key={client.client_id}>
                  <td>{client.client_id}</td>
                  <td>{client.total_orders}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ShowClientProductModal = ({ isOpen, onClose, categoryDetails }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Show Details</h2>
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Total Products Ordered</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
          {categoryDetails.map((client_prod) => (
                <tr key={client_prod.client_id}>
                  <td>{client_prod.client_id}</td>
                  <td>{client_prod.total_products}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ShowProductModal = ({ isOpen, onClose, categoryDetails }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Show Details</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Quantity Sold</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
          {categoryDetails.map((category, index) => (
                <tr key={index}>
                  <td>{category.OrderDate}</td>
                  <td>{category.TotalQuantity}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ShowMostModal = ({ isOpen, onClose, categoryDetails }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Show Details</h2>
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Category</th>
              <th>Total Quantity Bought</th>
            </tr>
          </thead>
          <tbody>
            {categoryDetails.map((category, index) => (
              <tr key={index}>
                <td>{category.Client_ID}</td>
                <td>{category.Client_Name}</td>
                <td>{category.Category}</td>
                <td>{category.TotalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ShowMonthlyModal = ({ isOpen, onClose, categoryDetails }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Show Details</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {categoryDetails.map((category, index) => (
              <tr key={index}>
                <td>{category.Month}</td>
                <td>{category.TotalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

