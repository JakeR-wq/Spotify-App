// not really the home, just what you see when you open the app

import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Home() {
  // for navigation
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Awesome App</h1>
        <p className="app-tagline">See how awesome your music taste is</p>
      </header>

      <div className="button-container">
        <button
          className="auth-button login-button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="auth-button register-button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Home;
