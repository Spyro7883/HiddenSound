import React, { useState, useEffect } from 'react';
import YouTubePlayer from './YoutubePlayer';

const YouTubePlaylist = ({ playlistId }: { playlistId: string }) => {
    const [videoIds, setVideoIds] = useState<string[]>([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`/api/playlists/getPlaylist?playlistId=${playlistId}`);
                const data = await response.json();
                setVideoIds(data.videoIds);
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    const handleVideoEnd = () => {
        // Move to the next video in the playlist
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoIds.length);
    };

    return (
        <div>
            {videoIds.length > 0 ? (
                <YouTubePlayer
                    videoId={videoIds[currentVideoIndex]}
                    onEnd={handleVideoEnd} // Automatically play the next video
                />
            ) : (
                <p>No videos in this playlist.</p>
            )}
        </div>
    );
};

export default YouTubePlaylist;
