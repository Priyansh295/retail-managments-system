import React, {useState} from 'react'
import '../styles/RegisterPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [inputs, setInputs] = useState({
    Client_ID: "",
    Client_Name: "",
    Email: "",
    phone_no: "",
    City: "",
    Pincode: "",
    Building: "",
    Floor_no: "",
    password: ""
  });
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const [err, setError] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/register", inputs);
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className='container_reg'>
          <h1>Register Page</h1>
          <div className='panel_reg'>
            <form onSubmit = {handleSubmit} className='form_reg'>
              <input required type="text" placeholder="Client_ID" name="Client_ID" onChange={handleChange} />
              <input required type="text" placeholder="Client_Name" name="Client_Name" onChange={handleChange} />
              <input required type="email" placeholder="Email" name="Email" onChange={handleChange} />
              <input required type="tel" placeholder="phone_no" name="phone_no" onChange={handleChange} />
              <input required type="text" placeholder="City" name="City" onChange={handleChange} />
              <input required type="text" placeholder="Pincode" name="Pincode" onChange={handleChange} />
              <input required type="text" placeholder="Building" name="Building" onChange={handleChange} />
              <input required type="text" placeholder="Floor_no" name="Floor_no" onChange={handleChange} />
              <input required type="password" placeholder="password" name="password" onChange={handleChange} />

              <button type="submit">Register</button>
              {err && <p>{err}</p>}
              <span>Do you have an account? <Link to = "/login">Login</Link> </span>
            </form>
          </div>
    </div>
  )
}

export default RegisterPage