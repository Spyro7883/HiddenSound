require('dotenv').config();
import React, { useState, useEffect } from 'react';
import PlaylistModal from './PlaylistModal';

interface YouTubeSearchProps {
    onVideoSelect: (videoId: string) => void;
}

const YouTubeSearch: React.FC<YouTubeSearchProps> = ({ onVideoSelect }) => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Array<{ id: string, title: string }>>([]);
    const [playlists, setPlaylists] = useState<Array<{ id: string, name: string }>>([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('/api/getUserId');
                const data = await response.json();
                setUserId(data.userId);

                if (data.userId) {
                    const playlistsResponse = await fetch(`/api/playlists/getAllPlaylists?userId=${data.userId}`);
                    const playlistsData = await playlistsResponse.json();
                    setPlaylists(playlistsData);
                }
            } catch (error) {
                console.error('Error fetching user ID or playlists:', error);
            }
        };

        fetchUserId();
    }, []);

    const searchYouTube = async () => {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API;

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
        setSelectedVideoId(videoId);
        onVideoSelect(videoId);
        setResults([]);
    };

    const handleAddToPlaylist = async () => {
        if (!selectedPlaylistId || !selectedVideoId) {
            alert('Please select a playlist and a song');
            return;
        }

        try {
            const response = await fetch('/api/playlists/addSong', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistId: selectedPlaylistId, videoId: selectedVideoId }),
            });

            if (response.ok) {
                alert('Song added to playlist successfully');
                setSelectedVideoId(null); // Clear the selection
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to add song to playlist');
            }
        } catch (error) {
            console.error('Error adding song to playlist:', error);
        }
    };

    const removeSongFromPlaylist = async (playlistId: string, videoId: string) => {
        try {
            const response = await fetch('/api/playlists/removeSong', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistId, videoId }),
            });

            if (response.ok) {
                alert('Song removed from playlist successfully');

            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to remove song from playlist');
            }
        } catch (error) {
            console.error('Error removing song from playlist:', error);
        }
    };

    return (
        <div className="xss:flex xss:flex-col xs:block">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a song"
                className="xss:w-full xs:w-3/5 min-w-40 xss:block xss:mx-auto xss:mb-2 xs:inline xs:mr-2 xs:mb-0 p-2 text-base rounded border border-gray-300 mr-2 bg-white text-black"
            />
            <button
                onClick={handleSearch}
                className="xss:w-3/5 xss:min-w-30 xs:min-w-0 xs:w-auto px-5 py-2 mx-auto text-base rounded bg-blue-500 text-white border-none cursor-pointer"
            >
                Search
            </button>

            <div>
                {results.map((video) => (
                    <div key={video.id} className="my-2">
                        <button
                            onClick={() => handleVideoSelect(video.id)}
                            className="block text-left p-2 w-full border border-gray-300"
                        >
                            {video.title}
                        </button>
                    </div>
                ))}
            </div>
            {selectedVideoId && playlists.length > 0 && (
                <div className="mt-4 xss:flex xss:flex-col xss:gap-2 xss:text-center xs:block xs:text-start">
                    <h3>Select a Playlist:</h3>
                    <select
                        value={selectedPlaylistId || ''}
                        onChange={(e) => setSelectedPlaylistId(e.target.value)}
                        className="p-2 bg-gray-700 text-white rounded-md"
                    >
                        <option value="" disabled>Select a playlist</option>
                        {playlists.map((playlist) => (
                            <option key={playlist.id} value={playlist.id}>
                                {playlist.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddToPlaylist}
                        className="xss:ml-0 xs:ml-2 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                        Add to Playlist
                    </button>
                    {selectedPlaylistId && selectedVideoId && (
                        <button
                            onClick={() => removeSongFromPlaylist(selectedPlaylistId, selectedVideoId)}
                            className="ml-2 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                        >
                            Remove Song
                        </button>
                    )}


                </div>
            )}

            <button className="pt-4" onClick={() => setShowPlaylistModal(true)}>
                Pick a playlist
            </button>

            {showPlaylistModal && userId && (
                <PlaylistModal userId={userId} onClose={() => setShowPlaylistModal(false)} />
            )}
        </div>
    );
};

export default YouTubeSearch;
