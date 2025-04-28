import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData
      );
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      alert("Login successful!");
      if (role === "volunteer") {
        navigate("/volunteer-home");
      } else if (role === "entity") {
        navigate("/entity");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Login failed: " + err.response.data);
    }
  };

  return (
    <div className="container">
      <h2>Welcome!</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        No account yet?{" "}
        <Link to="/signup" style={{ color: "green" }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;   
