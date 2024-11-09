import React, { useContext } from 'react'
import { AuthContext } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/NavbarClient.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHome, faUser, faSearch, faTicket, faWallet, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const NavbarClient = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleClick = (e) => {
    navigate("/client")
  }

  if(currentUser) {
    return (
      <nav className="navbarclient">
        <div className="container">
          <h1 onClick={handleClick}>Redline</h1>
          <div className="links">
            <span className="link active" onClick={() => navigate("/client")}>
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </span>
            <span className="link" onClick={() => navigate("/products")}>
              <FontAwesomeIcon icon={faSearch} />
              <span>Products</span>
            </span>
            <span className="link" onClick={() => navigate("/products/cart")}>
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Cart</span>
            </span>
            <span className="link" onClick={() => navigate("/products/order")}>
              <FontAwesomeIcon icon={faTicket} />
              <span>Orders</span>
            </span>
            <span className="link" onClick={() => navigate("/client-details")}>
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </span>
          </div>
          <div className='session_details'>
            <span className="user-info">
              <FontAwesomeIcon icon={faUser} />
              Client {currentUser?.Client_ID}
            </span>
            <span className="logout" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </span>
          </div>
        </div>
      </nav>
    )
  } else {
    return (
      <nav className="navbarclient">
        <div className="container">
          <h1>Welcome</h1>
          <div className="links">
            <Link className="link login-link" to="/login">
              Login
            </Link>
          </div>
        </div>
      </nav>
    )
  }
}

export default NavbarClient