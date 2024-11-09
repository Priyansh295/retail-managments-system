import React, { useEffect, useState } from 'react';
import '../styles/ProductParts.scss';
import axios from 'axios';

export const ProductPartsModal = ({ isOpen, onClose }) => {
  const [product, setProduct] = useState({
    Product_ID: '',
    Product_name: '',
    Product_description: '',
    Category: '',
    Price: '',
    Image: null,
  });
  const [msg, setMsg] = useState([])
  const [err, setError] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null)
    setMsg(null)
    try {
      const formData = new FormData();
      formData.append('Product_ID', product.Product_ID);
      formData.append('Product_Name', product.Product_name);
      formData.append('Product_Description', product.Product_description);
      formData.append('Category', product.Category);
      formData.append('Price', product.Price);
      formData.append('Image', product.Image);
      console.log(formData)
      const res = await axios.post('http://localhost:8800/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',},});
      console.log(res);
      setMsg(res.data);
    }
    catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleChange = (e) => {
    setError(null)
    setMsg(null)
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  

  const handleImageChange = (e) => {
    setProduct((prev) => ({ ...prev, Image: e.target.files[0] }));
  };

  return (
    <div className={`prod-modal ${isOpen ? 'open' : ''}`}>
      <span className="close-btn" onClick={onClose}>
          &times;
        </span>
      <div className="product-parts-container">
        {/* <span className="close-btn" onClick={onClose}>&times;</span> */}
        <h2>Add a Product</h2>
        <form className="product-parts-form" onSubmit={handleSubmit}>
          <label className="product-label">
            <span>Product ID:</span>
            <input required type="text" name="Product_ID" onChange={handleChange} />
          </label>
          <label className="product-label">
              <span>Product Name:</span>
              <input required type="text" name="Product_name" onChange={handleChange} />
          </label>
          <label className="product-label">
            <span>Product Description:</span>
            <input required type="text" name="Product_description" onChange={handleChange} />
          </label>
          <label className="product-label">
            <span>Product Category:</span>
            <input required type="text" name="Category" onChange={handleChange} />
          </label>
          <label className="product-label">
            <span>Product Image:</span>
            <input required type="file" accept=".jpeg, .jpg" name="Image" onChange={handleImageChange}/>
          </label>
          <label className="product-label">
            <span>Price:</span>
            <input required type="number" name="Price" onChange={handleChange} />
          </label>
          {msg && <p> {msg}</p>}
          {err && <p> {err}</p>}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export const ProductPartsUpdateModal = ({ isOpen, onClose, selectedProduct }) => {
  const [product, setProduct] = useState({
    Product_ID: selectedProduct.Product_ID,
    Product_Name: selectedProduct.Product_Name,
    Product_description: selectedProduct.Product_Description,
    Category: selectedProduct.Category,
    Price: selectedProduct.Price,
    Image: selectedProduct.Image,
  });
  const [msg, setMsg] = useState([])
  const [err, setError] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null)
    setMsg(null)
    try {
      const formData = new FormData();
      formData.append('Product_ID', product.Product_ID);
      formData.append('Product_Name', product.Product_name);
      formData.append('Product_Description', product.Product_description);
      formData.append('Category', product.Category);
      formData.append('Price', product.Price);
      console.log(formData)
      const res = await axios.put('http://localhost:8800/products/'+product.Product_ID, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',},});
      console.log(res);
      setMsg(res.data);
    }
    catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleChange = (e) => {
    setError(null)
    setMsg(null)
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={`prod-modal ${isOpen ? 'open' : ''}`}>
      <div className="product-parts-container">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Update Product</h2>
        <form className="product-parts-form" onSubmit={handleSubmit}>
          <label className="product-label">
            <span>Product ID:</span>
            <input disabled type="text" name="Product_ID" 
            onChange={handleChange} 
              defaultValue={product.Product_ID}
            />
          </label>
          <label className="product-label">
              <span>Product Name:</span>
              <input type="text" name="Product_Name"
              defaultValue={product.Product_Name}
               onChange={handleChange} />
          </label>
          <label className="product-label">
            <span>Product Description:</span>
            <input type="text" name="Product_description"
              defaultValue={product.Product_description}
             onChange={handleChange} />
          </label>
          <label className="product-label">
            <span>Product Category:</span>
            <input type="text" name="Category" 
            onChange={handleChange}
            defaultValue={product.Category}
             />
          </label>
          <label className="product-label">
            <span>Price:</span>
            <input type="number" name="Price" onChange={handleChange}
              defaultValue={product.Price}
             />
          </label>
          {msg && <p> {JSON.stringify(msg)}</p>}
          {err && <p> {err}</p>}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export const ProductPartsViewModal = ({ isOpen, onClose, selectedProduct }) => {
  const [parts, setParts] = useState([]);
  const [err, setError] = useState([])

  const fetchProductParts = async () => {
    try {
      console.log("here");
      const res = await axios.get('http://localhost:8800/products/parts/'+selectedProduct.Product_ID);
      console.log(res.data);
      setParts(res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Something went wrong!')
    }
  };

  useEffect(() => {
    fetchProductParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`prod-modal ${isOpen ? 'open' : ''}`}>
      <span className="close-btn" onClick={onClose}>
          &times;
        </span>
    </div>
  );
};

