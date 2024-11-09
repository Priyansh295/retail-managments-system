import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiShoppingCart, FiChevronDown, FiCheck } from 'react-icons/fi';
import '../styles/Home.scss';
import videoSrc from '../assets/home_vid.mp4';

const Home = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const featuredVehicles = [
    { name: "Tesla Model 3", price: "$41,190", image: '/images/tesla-model-3.jpeg' },
    { name: "Ford F-150", price: "$29,990", image: '/images/ford-150.jpeg' },
    { name: "Toyota Camry", price: "$25,295", image: '/images/toyota-camry.jpeg' }
  ];

  return (
    <div className="home">
      <main>
        <section className="hero">
          <video autoPlay loop muted className="hero-video">
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="hero-content">
            <h2 className="animate-on-scroll">Find Your Perfect Ride</h2>
            <p className="animate-on-scroll">Discover a wide range of quality vehicles at Redline</p>
            <Link to="/login" className="cta-button animate-on-scroll">
              Explore Vehicles <FiArrowRight />
            </Link>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="animate-on-scroll">Why Choose Redline?</h2>
            <div className="feature-grid">
              {[
                { title: "Wide Selection", description: "Browse through our extensive inventory of cars, trucks, and SUVs." },
                { title: "Quality Assured", description: "All our vehicles undergo rigorous inspections for your peace of mind." },
                { title: "Competitive Pricing", description: "Get the best deals with our transparent and fair pricing policy." }
              ].map((feature, index) => (
                <div key={index} className="feature-card animate-on-scroll">
                  <div className="feature-icon">
                    <FiCheck />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-vehicles">
          <div className="container">
            <h2 className="animate-on-scroll">Featured Vehicles</h2>
            <div className="vehicle-grid">
              {featuredVehicles.map((vehicle, index) => (
                <div key={index} className="vehicle-card animate-on-scroll">
                  <img src={vehicle.image} alt={vehicle.name} />
                  <div className="vehicle-info">
                    <h3>{vehicle.name}</h3>
                    <p>Starting at {vehicle.price}</p>
                    <button className="learn-more-button">Learn More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2 className="animate-on-scroll">Ready to Find Your Dream Car?</h2>
            <p className="animate-on-scroll">Browse our inventory and discover the perfect vehicle for you today!</p>
            <Link to="/login" className="cta-button animate-on-scroll">
              View Our Inventory <FiArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Connect With Us</h3>
              <ul>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Newsletter</h3>
              <p>Stay updated with our latest offers and news</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Redline. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;