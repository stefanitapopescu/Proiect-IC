import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/test")
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Fii schimbarea pe care vrei să o vezi în lume.</h1>
        <p>Alătură-te comunității noastre de voluntari și fă diferența!</p>
        <button onClick={() => navigate("/login")}>Începe acum</button>
      </div>
    </div>
  );
}

export default Home;
