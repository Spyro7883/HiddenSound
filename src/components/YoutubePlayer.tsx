import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from "./ui/button";
import { Slider } from "@/components/ui/slider"

interface YouTubePlayerProps {
  videoId: string;
  onEnd?: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onEnd }) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50); // Volume state (default 50%)
  const [currentTime, setCurrentTime] = useState<number>(0); // Current time in seconds
  const [duration, setDuration] = useState<number>(0); // Total duration in seconds

  // Construct thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  useEffect(() => {
    const createPlayer = () => {
      if (playerRef.current && window.YT && window.YT.Player) {
        const newPlayer = new window.YT.Player(playerRef.current, {
          height: "0", // Minimize the video player height
          width: "0", // Minimize the video player width
          videoId: videoId,
          playerVars: {
            autoplay: 1, // Auto-start the video
            controls: 0, // Hide player controls
            modestbranding: 1, // Minimize YouTube branding
            iv_load_policy: 3, // Hide video annotations
            rel: 0, // Do not show related videos at the end
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              setPlayer(event.target);
              setDuration(event.target.getDuration());
              event.target.playVideo();
              event.target.setVolume(volume); // Set initial volume
              setIsPlaying(true);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setDuration(event.target.getDuration());
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                setIsPlaying(false);
              }
              if (event.data === window.YT.PlayerState.ENDED && onEnd) {
                onEnd();
              }
            },
          },
        });
      }
    };

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
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
        playerRef.current.innerHTML = "";
      }
    };
  }, [videoId, volume, onEnd]);

  // Effect to update currentTime every second while the video is playing
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isPlaying && player) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000); // Update every second
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, player]);

  // Reset states when videoId changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (player) {
      player.stopVideo(); // Stop current video if any
      player.loadVideoById(videoId); // Load new video
      player.playVideo(); // Auto-play the new video
    }
  }, [videoId, player]);

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
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const handleSeek = (value: number[]) => {
    const seekToTime = value[0];
    if (player) {
      player.seekTo(seekToTime, true);
      setCurrentTime(seekToTime);
    }
  };

  return (
    <Card className="flex xss:flex-col xs:flex-row items-center p-4 mt-8 gap-8">
      <div id="player" ref={playerRef} className="absolute"></div>
      <img
        src={thumbnailUrl}
        alt="Video Thumbnail"
        className="w-full max-w-[120px] xss:m-0 xs:mb-2 rounded-lg border"
      />

      <div>
        <CardContent className="flex items-start gap-2 p-0 my-2 w-60">
          <Button className="pr-4" onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={handleStop}>Stop</Button>
        </CardContent>
        <div className="flex flex-col gap-2 my-2">
          <CardTitle>Volume: {volume}%</CardTitle>
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            min={0}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2 my-2">
          <CardTitle>
            {Math.floor(currentTime)} / {Math.floor(duration)} seconds
          </CardTitle>
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            max={duration}
            min={0}
            className="w-full"
          />
        </div>
      </div>
    </Card >
  );
};

export default YouTubePlayer;
