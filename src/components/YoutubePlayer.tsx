import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
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
  const [duration, setDuration] = useState<number>(0); // Total duration in seconds\
  const [videoTitle, setVideoTitle] = useState<string>(''); // Store video title
  const [channelName, setChannelName] = useState<string>(''); // Store channel name

  // Construct thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Fetch video details using YouTube API
  const fetchVideoDetails = async (videoId: string) => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API; // Make sure your API key is available here
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const videoSnippet = data.items[0].snippet;
        setVideoTitle(videoSnippet.title);
        setChannelName(videoSnippet.channelTitle);
      } else {
        setVideoTitle('Unknown Video');
        setChannelName('Unknown Channel');
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
      setVideoTitle('Unknown Video');
      setChannelName('Unknown Channel');
    }
  };

  useEffect(() => {
    fetchVideoDetails(videoId); // Fetch the video title and channel name when videoId changes
  }, [videoId]);

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

  const handleSkip = () => {
    if (player && duration > 0) {
      // Skip to the end of the video and update the currentTime state
      player.seekTo(duration - 1, true);
      setCurrentTime(duration); // Set current time to the end
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
    <Card className="flex xss:flex-col xs:flex-row items-center p-6 mt-8 gap-8">
      <CardHeader className="p-0  xss:items-center xs:items-start xss:text-center xs:text-start">
        <div className="space-y-0">
          <div id="player" ref={playerRef} className="absolute hidden" />
          <img
            src={thumbnailUrl}
            alt={videoTitle}
            className="w-[150px] h-[84px] xss:m-0 xs:mb-2 rounded-lg border object-cover"
          />
        </div>

        <CardTitle className="pt-2 max-w-[30ch]">
          {videoTitle}
        </CardTitle>
        <CardDescription className="p-0">
          {channelName}
        </CardDescription>
      </CardHeader>

      <div className="flex flex-col gap-2">
        <CardContent className="flex items-start gap-2 p-0 my-0 w-60">
          <Button className="pr-4" onClick={handlePlayPause}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              {isPlaying ?
                <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                :
                <path fill="currentColor" d="M8 5v14l11-7z" />
              }
            </svg>
          </Button>
          <Button onClick={handleSkip}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M6 18l8.5-6L6 6v12zm8.5-6L18 6v12z" />

            </svg>
          </Button>
        </CardContent>
        <div className="flex flex-col gap-2 my-0">
          <p>Volume: {volume}%</p>
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            min={0}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2 my-0">
          <p>
            {Math.floor(currentTime)} / {Math.floor(duration)} seconds
          </p>
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
