// StorageModal.jsx

import React, { useEffect, useState } from 'react';
import "../styles/SupplierModal.scss"
import axios from 'axios';

export const StoreModal = ({ isOpen, onClose, store }) => {
  const [updatedStore, setUpdatedStore] = useState({
    Store_id: store.Store_id,
    Quantity: store.Quantity,
    Park_no: store.Park_no,
    Block_no: store.Block_no,
    Threshold: store.Threshold,
  });

  const [msg, setMsg] = useState([])
  const [err, setError] = useState([])

  const handleInputChange = (e) => {
    setError(null);

    const { name, value, type } = e.target;
    const convertedValue = type === 'number' ? parseFloat(value) : value;
    setUpdatedStore((prevStore) => ({
      ...prevStore,
      [name]: convertedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log('Updated Store:', updatedStore);
    try {
      const Store_id = store.Store_id;
      console.log(Store_id);
      const res = await axios.put("http://localhost:8800/stores/"+Store_id, updatedStore)
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
        <h2>Edit Store</h2>
        <form onSubmit={handleSubmit}>
          <strong>Store_id  - {store.Store_id}</strong>
          <label className="label" htmlFor="storeName">
            <span>Product_id:</span>
            <input required disabled
              type="text"
              id="Product_ID"
              name="Product_ID"
              value={store.Product_ID}
            />
          </label>
          <label className="label">
            <span>Quantity:</span>
            <input required
              type="number"
              id="Quantity"
              name="Quantity"
              min = "1"
              defaultValue={updatedStore.Quantity}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Park Number:</span>
            <input required
              type= "text"
              id="Park_no"
              name="Park_no"
              defaultValue={updatedStore.Park_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Block Number:</span>
            <input required
              type="text"
              id="Block_no"
              name="Block_no"
              defaultValue={updatedStore.Block_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Theshold</span>
            <input required
              type="number"
              id="Threshold"
              name="Threshold"
              defaultValue={updatedStore.Threshold}
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

export const StoreAddModal = ({ isOpen, onClose }) => {
  const [newStore, setNewStore] = useState({
    Store_id: '',
    Product_ID: '',
    Quantity: '',
    Park_no: '',
    Block_no: '',
    Threshold: 0,
  });
  const [products, setproducts] = useState([]);
  const [msg, setMsg] = useState([]);
  const [err, setError] = useState([]);

  const handleInputChange = (e) => {
    setError(null);
    const { name, value, type } = e.target;
    const convertedValue = type === 'number' ? parseFloat(value) : value;
    setNewStore((prevStore) => ({
      ...prevStore,
      [name]: convertedValue,
    }));
  };

  const fetchproducts = async () => {
    try {
      const res = await axios.get('http://localhost:8800/products');
      console.log(res.data);
      setproducts(res.data);
    } catch (err) {
      console.log(err);
      // setError(err.response.data);
    }
  };

  useEffect(() => {
    fetchproducts();
  }, []);

  const handleproductSelectChange = (e) => {
    setNewStore((prevStore) => ({
      ...prevStore,
      Product_ID: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('http://localhost:8800/stores/add', newStore);
      console.log(res?.data || "Success");
      setMsg(res?.data)
    } catch (err) {
      setError(err.response?.data);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} id="modalcontainer">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Add New Store</h2>
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="storeID">
            <span>Store ID:</span>
            <input
              required
              type="text"
              id="storeID"
              name="Store_id"
              defaultValue={newStore.Store_id}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Product ID:</span>
            <select
              required
              id="productID"
              name="Product_ID"
              value={newStore.Product_ID}
              onChange={handleproductSelectChange}
            >
              <option value="" disabled>
                Select Product ID
              </option>
              {products.map((product) => (
                <option key={product.Product_ID} value={product.Product_ID}>
                  {product.Product_ID}
                </option>
              ))}
            </select>
          </label>
          <label className="label">
            <span>Quantity:</span>
            <input
              required
              type="text"
              id="Quantity"
              name="Quantity"
              defaultValue={newStore.Quantity}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Park Number:</span>
            <input
              required
              type="text"
              id="Park_no"
              name="Park_no"
              defaultValue={newStore.Park_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Block Number:</span>
            <input
              required
              type="text"
              id="Block_no"
              name="Block_no"
              defaultValue={newStore.Block_no}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            <span>Threshold:</span>
            <input
              required
              type="number"
              id="Threshold"
              name="Threshold"
              min="0"
              defaultValue={newStore.Threshold}
              onChange={handleInputChange}
            />
          </label>
          {msg && <p>{msg}</p>}
          {err && <p>{err}</p>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
