import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { FiMinus, FiPlus, FiHeart, FiTrash2 } from 'react-icons/fi';
import '../styles/Cart.scss';

const Cart = () => {
  const [cartContents, setCartContents] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchCartContents();
  }, []);

  const fetchCartContents = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/products/cart/${currentUser.Client_ID}`);
      const cartWithQuantity = response.data.map(product => ({ ...product, quantity: 1 }));
      setCartContents(cartWithQuantity);
    } catch (error) {
      console.error('Error fetching cart contents:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:8800/products/cart/${currentUser.Client_ID}/${productId}`);
      fetchCartContents();
    } catch (error) {
      console.error('Error removing item from the cart:', error);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartContents.map(product =>
      product.product_id === productId
        ? { ...product, quantity: Math.max(1, newQuantity) }
        : product
    );
    setCartContents(updatedCart);
  };

  const calculateSubtotal = () => {
    return cartContents.reduce((total, product) => {
      const price = parseFloat(product.Price) || 0;
      return total + price * product.quantity;
    }, 0);
  };

  const applyPromoCode = () => {
    if (promoCode === 'LUXURY20') {
      setDiscount(0.2);
    } else {
      setDiscount(0);
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (subtotal * discount);
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const OrderFinal = async () => {
    try {
      const total_price = calculateTotal();
      const res = await axios.get('http://localhost:8800/timestamp');
      const OrderDate = res.data;
      const Order_ID = `${currentUser.Client_ID}_${OrderDate}`;

      const formData = new FormData();
      formData.append('Order_id', Order_ID);
      formData.append('client_id', currentUser.Client_ID);
      formData.append('Total_payment', total_price);
      formData.append('Status', 'In Progress');
      await axios.post('http://localhost:8800/products/order', formData);

      const orderLineItems = cartContents.map(product => ({
        Product_ID: product.product_id,
        Status: 'In Progress', 
        Quantity: product.quantity,
      }));

      await Promise.all(orderLineItems.map(async (orderLineItem) => {
        const formData = new FormData();
        formData.append('Order_ID', Order_ID);
        formData.append('Product_ID', orderLineItem.Product_ID);
        formData.append('Status', orderLineItem.Status);
        formData.append('Quantity', orderLineItem.Quantity);
        await axios.post('http://localhost:8800/products/order_lines', formData);
      }));

      await axios.post('http://localhost:8800/procedure', [Order_ID]);
      window.location.href = '/products/order';
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Luxury Shopping Experience</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartContents.length > 0 ? (
            cartContents.map((product) => (
              <div className="cart-item" key={product.product_id}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/${product.Image}`}
                  alt={product.Product_Name}
                  className="product-image"
                />
                <div className="product-details">
                  <h2>{product.Product_Name}</h2>
                  <p className="product-category">{product.Category}</p>
                  <p className="product-price">${formatPrice(product.Price)}</p>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(product.product_id, product.quantity - 1)}>
                      <FiMinus />
                    </button>
                    <span>{product.quantity}</span>
                    <button onClick={() => updateQuantity(product.product_id, product.quantity + 1)}>
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="save-for-later">
                    <FiHeart />
                    Save
                  </button>
                  <button className="remove-item" onClick={() => removeFromCart(product.product_id)}>
                    <FiTrash2 />
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-cart-message">Your luxury cart awaits your exquisite choices.</p>
          )}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${formatPrice(calculateSubtotal())}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span>-${formatPrice(calculateSubtotal() * discount)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${formatPrice(calculateTotal())}</span>
          </div>
          <div className="promo-code">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={applyPromoCode}>Apply</button>
          </div>
          <button className="checkout-button" onClick={OrderFinal}>
            <Link to="/products/order">
            Complete Luxury Purchase
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;