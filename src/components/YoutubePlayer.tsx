import React, { useEffect, useRef, useState } from 'react';

interface YouTubePlayerProps {
    videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
    const playerRef = useRef<HTMLDivElement | null>(null);
    const [player, setPlayer] = useState<YT.Player | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    useEffect(() => {
        const createPlayer = () => {
            if (playerRef.current && window.YT && window.YT.Player) {
                const newPlayer = new window.YT.Player(playerRef.current, {
                    height: '0', // Minimize the video player height
                    width: '0',  // Minimize the video player width
                    videoId: videoId,
                    playerVars: {
                        autoplay: 1,   // Auto-start the video
                        controls: 0,   // Hide player controls
                        modestbranding: 1, // Minimize YouTube branding
                        iv_load_policy: 3, // Hide video annotations
                        rel: 0,        // Do not show related videos at the end
                    },
                    events: {
                        onReady: (event: YT.PlayerEvent) => {
                            event.target.playVideo();
                            setPlayer(event.target);
                        },
                    },
                });
            }
        };

        const loadYouTubeAPI = () => {
            if (!window.YT) {
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                script.async = true;
                script.onload = () => {
                    window.onYouTubeIframeAPIReady = createPlayer;
                };
                document.body.appendChild(script);
            } else {
                createPlayer();
            }
        };

        loadYouTubeAPI();

        return () => {
            if (playerRef.current) {
                playerRef.current.innerHTML = '';
            }
        };
    }, [videoId]);

    const handlePlayPause = () => {
        if (player) {
            if (isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleStop = () => {
        if (player) {
            player.stopVideo();
            setIsPlaying(false);
        }
    };

    return (
        <div>
            <div id="player" ref={playerRef}></div>
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
};

export default YouTubePlayer;
