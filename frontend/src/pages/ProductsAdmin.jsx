import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductsAdmin.scss';
import { ProductPartsModal, ProductPartsUpdateModal, ProductPartsViewModal } from './ProductParts';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [err, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [msg, setMsg] = useState(null);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8800/products');
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddButton = () => {
    setMsg(null);
    setIsAddModalOpen(true);
  };

  const openUpdateModal = (product) => {
    setMsg(null);
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const openViewModal = (product) => {
    setMsg(null);
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsUpdateModalOpen(false);
    setIsAddModalOpen(false);
    setIsViewModalOpen(false);
    fetchAllProducts();
  };

  const handleDelete = async (prod) => {
    try {
      const res = await axios.delete(`http://localhost:8800/products/${prod.Product_ID}`);
      fetchAllProducts();
      setMsg(res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const filteredProducts = products.filter(
    (prod) =>
      prod.Product_Name.toLowerCase().includes(searchInput.toLowerCase()) &&
      (selectedCategory === '' || selectedCategory === prod.Category)
  );

  const allCategories = ['', ...new Set(products.map((prod) => prod.Category))];

  // Helper function to format price
  const formatPrice = (price) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? 'N/A' : `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className='products-admin'>
      <h1 className="title">Products Administration</h1>
      <div className='admin-controls'>
        <div className='search-bar'>
          <FiSearch />
          <input
            type="text"
            placeholder="Search for a product"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </div>
        <button className='add-button' onClick={handleAddButton}>
          <FiPlus /> Add New Product
        </button>
        <div className='select-bar'>
          <label htmlFor="category">Category:</label>
          <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category === '' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>
      {err && <p className="error-message">{err}</p>}
      {msg && <p className="success-message">{msg}</p>}
      <div className="products-grid">
        {filteredProducts.map((prod) => (
          <div key={prod.Product_ID} className="product-card">
            <img
              src={`${process.env.PUBLIC_URL}/images/${prod.Image}`}
              alt={prod.Product_Name}
              className="product-image"
            />
            <div className="product-details">
              <h2>{prod.Product_Name}</h2>
              <p className="category">Category: {prod.Category}</p>
              <p className="price">{formatPrice(prod.Price)}</p>
              <p className="description">{prod.Product_Description}</p>
            </div>
            <div className='action-buttons'>
              <button onClick={() => openUpdateModal(prod)} className="update-btn">
                <FiEdit2 /> Update
              </button>
              <button onClick={() => handleDelete(prod)} className="delete-btn">
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {isAddModalOpen && (
        <ProductPartsModal isOpen={isAddModalOpen} onClose={closeModal} />
      )}
      {isUpdateModalOpen && (
        <ProductPartsUpdateModal isOpen={isUpdateModalOpen} onClose={closeModal} selectedProduct={selectedProduct} />
      )}
      {isViewModalOpen && (
        <ProductPartsViewModal isOpen={isViewModalOpen} onClose={closeModal} selectedProduct={selectedProduct} />
      )}
    </div>
  );
};

export default ProductsAdmin;