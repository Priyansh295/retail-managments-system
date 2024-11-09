// SupplierModal.jsx

import React, { useEffect, useState } from 'react';
import "../styles/SupplierModal.scss"
import axios from 'axios';

export const SupplierModal = ({ isOpen, onClose, supplier }) => {
  const [updatedSupplier, setUpdatedSupplier] = useState({
    Supplier_id: supplier.Supplier_id,
    Supplier_name: supplier.Supplier_name,
    Quantity: supplier.Quantity,
    Email: supplier.Email,
    Phone_no: supplier.Phone_no,
    Address: supplier.Address,
    Price: supplier.Price,
    Restock_time: supplier.Restock_time,
  });

  const [msg, setMsg] = useState([])
  const [err, setError] = useState([])

  const handleInputChange = (e) => {
    setError(null);

    const { name, value, type } = e.target;
    const convertedValue = type === 'number' ? parseFloat(value) : value;
    setUpdatedSupplier((prevSupplier) => ({
      ...prevSupplier,
      [name]: convertedValue,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log('Updated Supplier:', updatedSupplier);
    try {
      const Supplier_id = supplier.Supplier_id;
      console.log(Supplier_id);
      const res = await axios.put("http://localhost:8800/suppliers/"+Supplier_id, updatedSupplier)
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
        <h2>Edit Supplier</h2>
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="supplierName">
            <span>Supplier Name:</span>
            <input required
              type="text"
              id="supplierName"
              name="Supplier_name"
              defaultValue={updatedSupplier.Supplier_name}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Quantity:</span>
            <input required
              type="number"
              id="Quantity"
              name="Quantity"
              min = "1"
              defaultValue={updatedSupplier.Quantity}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Email:</span>
            <input required
              type="email"
              id="Email"
              name="Email"
              defaultValue={updatedSupplier.Email}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Phone_no:</span>
            <input required
              type="tel"
              id="Phone_no"
              name="Phone_no"
              defaultValue={updatedSupplier.Phone_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Address:</span>
            <input required
              type="tel"
              id="Address"
              name="Address"
              defaultValue={updatedSupplier.Address}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Restock Time (days):</span>
            <input required
              type="number"
              id="Restock_time"
              name="Restock_time"
              defaultValue={updatedSupplier.Restock_time}
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

export const SupplierAddModal = ({ isOpen, onClose }) => {
  const [newSupplier, setNewSupplier] = useState({
    Supplier_id: '',
    Supplier_name: '',
    Quantity: 0,
    Email: '',
    Phone_no: '',
    Address: '',
    Restock_time: 0,
  });

  const [parts, setParts] = useState([]);
  const [msg, setMsg] = useState([])
  const [err, setError] = useState([])
  const handleInputChange = (e) => {
    setError(null);
    const { name, value, type } = e.target;
    const convertedValue = type === 'number' ? parseFloat(value) : value;
    setNewSupplier((prevSupplier) => ({
      ...prevSupplier,
      [name]: convertedValue,
    }));
  };

  useEffect(() => {
    fetchParts();
  }, []);
  const fetchParts = async () => {
    try {
      const res = await axios.get('http://localhost:8800/parts');
      console.log(res.data);
      setParts(res.data);
    } catch (err) {
      console.log(err);
      // setError(err.response.data);
    }
  };

  const handlePartSelectChange = (e) => {
    setNewSupplier((prevSupplier) => ({
      ...prevSupplier,
      Part_id: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log(newSupplier);
    try {
      const res = await axios.post("http://localhost:8800/suppliers/add",
                               newSupplier);
      console.log(res)
      console.log('Added Supplier:', newSupplier);
      setMsg(res.data);
    } catch (err) {
      setError(err.response?.data);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Add New Supplier</h2>
        <form  onSubmit={handleSubmit}>
          <label className="label" htmlFor="supplierID">
            <span>Supplier ID:</span>
            <input required
              type="text"
              id="supplierID"
              name="Supplier_id"
              defaultValue={newSupplier.Supplier_id}
              onChange={handleInputChange}
            />
          </label>
          <label className="label" htmlFor="supplierName">
            <span>Supplier Name:</span>
            <input required
              type="text"
              id="supplierName"
              name="Supplier_name"
              defaultValue={newSupplier.Supplier_name}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Quantity:</span>
            <input required
              type="number"
              id="Quantity"
              name="Quantity"
              min = "1"
              defaultValue={newSupplier.Quantity}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Email:</span>
            <input required
              type="email"
              id="Email"
              name="Email"
              defaultValue={newSupplier.Email}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Phone_no:</span>
            <input required
              type="tel"
              id="Phone_no"
              name="Phone_no"
              defaultValue={newSupplier.Phone_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Address:</span>
            <input required
              type="text"
              id="Address"
              name="Address"
              defaultValue={newSupplier.Address}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Restock Time (days):</span>
            <input required
              type="number"
              id="Restock_time"
              name="Restock_time"
              defaultValue={newSupplier.Restock_time}
              onChange={handleInputChange}
            />
          </label>
          {msg && <p> {msg}</p>}
          {err && <p> {JSON.stringify(err)}</p>}
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};