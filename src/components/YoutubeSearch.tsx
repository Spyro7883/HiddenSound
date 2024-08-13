require('dotenv').config();
import React, { useState } from 'react';

interface YouTubeSearchProps {
    onVideoSelect: (videoId: string) => void;
}

const YouTubeSearch: React.FC<YouTubeSearchProps> = ({ onVideoSelect }) => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Array<{ id: string, title: string }>>([]);

    console.log(process.env.REACT_APP_YOUTUBE_API);

    const searchYouTube = async () => {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API; // Ensure this is set correctly

        // First clear previous results
        setResults([]);

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${apiKey}`
            );
            const data = await response.json();

            const videos = data.items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
            }));

            setResults(videos);
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
        }
    };

    const handleSearch = () => {
        if (query.trim()) {
            searchYouTube();
        }
    };

    const handleVideoSelect = (videoId: string) => {
        onVideoSelect(videoId);
        setResults([]); // Clear search results after selecting a video
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a song"
                className="w-3/5 p-2 text-base rounded border border-gray-300 mr-2 bg-white text-black"
            />
            <button
                onClick={handleSearch}
                className="px-5 py-2 text-base rounded bg-blue-500 text-white border-none cursor-pointer"
            >
                Search
            </button>

            <div>
                {results.map((video) => (
                    <div key={video.id} style={{ margin: '10px 0' }}>
                        <button
                            onClick={() => handleVideoSelect(video.id)}
                            className="block text-left p-2 w-full border border-gray-300"
                        >
                            {video.title}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouTubeSearch;
