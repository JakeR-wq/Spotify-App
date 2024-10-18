// main tracks page
import './App.css'
import React from 'react';

function Main() {
    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/spotify_login'; // Flask URL
    };

    return (
        <div>
            <h1>Spotify Login</h1>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
};

export default Main;
