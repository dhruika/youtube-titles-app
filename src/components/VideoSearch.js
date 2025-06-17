import React, { useState } from 'react';
import './VideoSearch.css';

function VideoSearch() {
    const [topic, setTopic] = useState('');
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic!');
            return;
        }

        setLoading(true);
        setTitles([]);
        setError('');

        try {
            const response = await fetch('/api/youtube-titles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: topic }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch titles');
            }

            const data = await response.json();
            setTitles(Array.isArray(data.titles) ? data.titles : [data]);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Something went wrong 💔 Please try again.');
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
                disabled={loading}
            />

            <button onClick={handleGenerate} disabled={loading || !topic.trim()}>
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