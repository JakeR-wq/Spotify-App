// login page

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { username, password };

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.status === 200) {
        nav('/spotify-tracks')
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="app-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="form-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
