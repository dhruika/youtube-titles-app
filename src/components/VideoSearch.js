// components/VideoSearch.js

import React, { useState } from 'react';
import './VideoSearch.css'; // optional if styling is present

function VideoSearch() {
    const [topic, setTopic] = useState('');
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert('Please enter a topic!');
            return;
        }

        setLoading(true);
        setTitles([]);
        setError('');

        try {
            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) throw new Error('Failed to fetch titles');

            const data = await response.json();
            setTitles(data.titles || []);
        } catch (err) {
            console.error(err);
            setError('Something went wrong 💔 Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="video-search-container">
            <h2>🎬 YouTube Title Generator</h2>

            <input
                type="text"
                placeholder="Enter video topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />

            <button onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Titles'}
            </button>

            {error && <p className="error">{error}</p>}

            <div className="results">
                {titles.length > 0 && <h3>Suggested Titles:</h3>}
                <ul>
                    {titles.map((title, index) => (
                        <li key={index}>{title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default VideoSearch;
