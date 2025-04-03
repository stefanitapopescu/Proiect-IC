import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', formData);
      // Presupunem că răspunsul este un text de forma "Login successful. Token: <token>"
      const tokenPrefix = "Login successful. Token: ";
      const token = res.data.substring(tokenPrefix.length).trim();
      
      // Stochează tokenul în localStorage
      localStorage.setItem("token", token);
      
      // Setează header-ul Authorization implicit pentru Axios
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert("Login failed: " + err.response.data);
    }
  };

  return (
    <div className="container">
      <h2>Welcome!</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>No account yet? <span onClick={() => navigate('/signup')}>Sign up</span></p>
    </div>
  );
}

export default Login;
