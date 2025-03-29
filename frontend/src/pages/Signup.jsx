import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'volunteer'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/signup', formData);
      alert("Account created!");
      navigate('/');
    } catch (err) {
      alert("Error: " + err.response.data);
    }
  };

  return (
    <div className="container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <select name="role" onChange={handleChange}>
          <option value="volunteer">Volunteer</option>
          <option value="entity">Entity / Organization</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <span onClick={() => navigate('/')}>Login</span></p>
    </div>
  );
}

export default Signup;
