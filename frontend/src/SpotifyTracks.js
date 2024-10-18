import React, { useState, useEffect } from 'react';

const SpotifyTracks = () => {
    const [topTracks, setTopTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = () => {
        window.location.href = 'http://localhost:5000/spotify_login';
    };

    const getTopTracks = async (accessToken) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/add_tracks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Fetched Data:", data);
            if (data.items) {
                setTopTracks(data.items); 
            } else {
                throw new Error('No items found in response');
            }
        } catch (err) {
            console.error("Error fetching top tracks:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const accessToken = queryParams.get('access_token');
        if (accessToken) {
            getTopTracks(accessToken);
        }
    }, []);

    return (
        <div>
            <h1>Your Top Tracks on Spotify</h1>
            {loading && <p>Loading your top tracks...</p>}
            {error && <p>Error: {error}</p>}
            {topTracks.length > 0 ? (
                <ul>
                    {topTracks.map(track => (
                        <li key={track.id}>
                            <strong>{track.name}</strong> by {track.artists.map(artist => artist.name).join(', ')}
                            <br />
                            <img src={track.album.images[0].url} alt={track.name} style={{ width: '50px' }} />
                        </li>
                    ))}
                </ul>
            ) : !loading ? (
                <button onClick={login}>Login with Spotify</button>
            ) : null}
        </div>
    );
};

export default SpotifyTracks;
