// main routing file

import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Main from "./Main";
import SpotifyTracks from "./SpotifyTracks";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/main" element={<Main />} />
      <Route path="/spotify-tracks" element={<SpotifyTracks />} />
    </Routes>
  );
}
