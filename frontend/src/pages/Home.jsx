import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {}
      <section className="hero-section">
        <div className="content-container hero-container">
          <div className="hero-content">
            <h1>Fii schimbarea pe care vrei să o vezi în lume</h1>
            <p className="hero-subtitle">
              Alătură-te comunității noastre de voluntari și fă diferența chiar acum.
              Împreună putem construi un viitor mai bun.
            </p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => navigate("/signup")}>
                Înscrie-te acum
              </button>
              <button className="secondary-button" onClick={() => navigate("/login")}>
                Autentificare
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="/volunteerhub-hero.svg"
              alt="VolunteerHub - Platforma care conectează voluntarii cu organizațiile pentru impact pozitiv în comunitate. Câștigă puncte și recompense prin voluntariat!"
              className="hero-volunteer-image"
            />
          </div>
        </div>
      </section>
      
      {}
      <section className="how-it-works-section">
        <div className="content-container">
          <h2 className="section-header">Cum funcționează</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Înscrie-te</h3>
              <p>Creează un cont și completează profilul tău de voluntar sau organizație.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Găsește oportunități</h3>
              <p>Explorează acțiunile de voluntariat disponibile și înscrie-te la cele care te pasionează.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Adună puncte</h3>
              <p>Primești puncte pentru fiecare acțiune la care participi.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Revendică premii</h3>
              <p>Folosește punctele acumulate pentru a obține premii din shop.</p>
            </div>
          </div>
        </div>
      </section>
      
      {}
      <section className="features-section">
        <div className="content-container">
          <h2 className="section-header">Ce oferim</h2>
          <div className="features-container">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Oportunități diverse</h3>
              <p>Acțiuni de voluntariat pentru toate pasiunile și interesele.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-gift"></i>
              </div>
              <h3>Sistem de recompense</h3>
              <p>Primești puncte și premii pentru implicarea ta.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Comunitate activă</h3>
              <p>Conectează-te cu alți voluntari și organizații.</p>
            </div>
          </div>
        </div>
      </section>
      
      {}
      <section className="cta-section">
        <div className="content-container">
          <h2>Gata să faci o diferență?</h2>
          <p>Alătură-te miilor de voluntari care schimbă lumea în bine.</p>
          <button onClick={() => navigate("/signup")}>Începe acum</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
