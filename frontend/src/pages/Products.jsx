import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FiHeart, FiShoppingCart, FiSearch } from 'react-icons/fi';
import '../styles/Products.scss';

// Import AuthContext from the correct path
import { AuthContext } from '../context/authContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8800/products');
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllProducts();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const addToCart = async (productId) => {
    try {
      if (!currentUser) {
        // Handle the case when the user is not logged in
        console.log('User not logged in');
        // You might want to redirect to login page or show a message
        return;
      }
      const formData = new FormData();
      formData.append('user_id', currentUser.Client_ID);
      formData.append('product_id', productId);
      await axios.post('http://localhost:8800/products/cart/add', formData);
      window.location.href = '/products/cart';
    } catch (error) {
      console.error('Error adding item to cart:', error);
      window.location.href = '/products/cart';
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
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for a product..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      <div className="products-content">
        <aside className="filters">
          <h2>Filters</h2>
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category === '' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </aside>
        <main className="product-grid">
          {filteredProducts.map((prod) => (
            <div key={prod.Product_ID} className="product-card">
              <div className="product-image-container">
                <img
                  src={`${process.env.PUBLIC_URL}/images/${prod.Image}`}
                  alt={prod.Product_Name}
                  className="product-image"
                />
                <button className="favorite-btn" aria-label="Add to favorites">
                  <FiHeart />
                </button>
              </div>
              <div className="product-info">
                <h3>{prod.Product_Name}</h3>
                <p className="product-category">{prod.Category}</p>
                <p className="product-price">{formatPrice(prod.Price)}</p>
                <p className="product-description">{prod.Product_Description}</p>
              </div>
              <button className="cart-btn" onClick={() => addToCart(prod.Product_ID)}>
                <FiShoppingCart />
                Add to Cart
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Products;