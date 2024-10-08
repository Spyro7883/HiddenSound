require('dotenv').config();
import React, { useState, useEffect } from 'react';
import PlaylistModal from './PlaylistModal';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


interface YouTubeSearchProps {
    onVideoSelect: (videoId: string) => void;
}

const YouTubeSearch: React.FC<YouTubeSearchProps> = ({ onVideoSelect }) => {
    const [inputValue, setInputValue] = useState<string>('');
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
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(inputValue)}&key=${apiKey}`
            );
            const data = await response.json();

            const videos = data.items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
            }));

            setResults(videos);
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            setResults([]);
        }
    };

    const handleSearch = () => {
        if (inputValue.trim()) {
            searchYouTube();
        }
    };

    const handleVideoSelect = (videoId: string) => {
        setSelectedVideoId(videoId);
        onVideoSelect(videoId);
        setResults([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
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
                setSelectedVideoId(null);
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
            <Input
                type="search"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search"
                className="xss:w-full xs:w-3/5 xss:block xss:mx-auto xss:mb-2 xs:inline xs:mr-2 xs:mb-0 p-2 mr-2"
            />
            <Button
                onClick={handleSearch}
                className="px-5 py-2 mx-auto"
            >
                Search
            </Button>
            {results.length > 0 && (
                <div>

                    {results.map((video) => (
                        <Card key={video.id} className="my-2">
                            <CardContent className="p-4 hover:bg-accent cursor-pointer"
                                onClick={() => handleVideoSelect(video.id)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleVideoSelect(video.id);
                                    }
                                }}
                                aria-label={`Select video: ${video.title}`}>
                                <CardTitle className="font-normal">{video.title}</CardTitle>
                            </CardContent>
                        </Card>
                    ))}

                </div>
            )}
            {selectedVideoId && playlists.length > 0 && (
                <div className="mt-4 xss:flex xss:flex-col xss:gap-2 xss:text-center xs:block xs:text-start">
                    <h3>Select a Playlist:</h3>

                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className='xss:mr-0 xs:mr-2'>
                                {selectedPlaylistId
                                    ? playlists.find((playlist) => playlist.id === selectedPlaylistId)?.name
                                    : "Select a Playlist"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {playlists.map((playlist) => (
                                <DropdownMenuItem
                                    key={playlist.id}
                                    onClick={() => setSelectedPlaylistId(playlist.id)}
                                >
                                    {playlist.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={handleAddToPlaylist}
                        className="xss:mr-0 xs:mr-2 mt-2 bg-green-500 hover:bg-green-700 py-2 px-4"
                    >
                        Add to Playlist
                    </Button>
                    {selectedPlaylistId && selectedVideoId && (
                        <Button
                            onClick={() => removeSongFromPlaylist(selectedPlaylistId, selectedVideoId)}
                            className="xss:mr-0 xs:mr-2 mt-2 bg-red-500 hover:bg-red-700 py-2 px-4"
                        >
                            Remove Song
                        </Button>
                    )}


                </div>
            )}


            <Popover
                open={showPlaylistModal}
                onOpenChange={setShowPlaylistModal}>
                <PopoverTrigger asChild>
                    <Button className="mt-4" onClick={() => setShowPlaylistModal(true)}>
                        Pick a playlist
                    </Button>
                </PopoverTrigger>
                {userId && (
                    <PopoverContent>
                        <PlaylistModal userId={userId} onClose={() => setShowPlaylistModal(false)} />
                    </PopoverContent>
                )}
            </Popover>
        </div>
    );
};

export default YouTubeSearch;
