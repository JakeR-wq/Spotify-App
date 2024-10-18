// register page

import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { email, password, name, username };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.status === 201) {
        nav('/spotify-tracks')
      } else {
        return alert("Error registering user ghjk");
      }
    } catch (error) {
      return alert("Error registering user" + error.message);
    }
  };

  return (
    <div className="app-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Register
        </button>
      </form>
    </div>
  );
  
}

export default Register;
