import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PlaylistModalProps {
    onClose: () => void;
    userId: string;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ onClose, userId }) => {
    const [playlistName, setPlaylistName] = useState('');
    const [playlists, setPlaylists] = useState<Array<{ id: string, name: string }>>([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`/api/playlists/getAllPlaylists?userId=${userId}`);
                const data = await response.json();
                setPlaylists(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, [userId]);

    const createPlaylist = async () => {
        if (!playlistName.trim()) {
            console.log('Playlist name cannot be empty');
            return;
        }

        try {
            const response = await fetch('/api/playlists/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playlistName, userId }),
            });

            if (response.ok) {
                const newPlaylist = await response.json();
                setPlaylists([...playlists, newPlaylist]);
                setPlaylistName('');
                console.log('Playlist created successfully');
            } else {
                const errorData = await response.json();
                console.log(errorData.error || 'Failed to create playlist');
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    const deletePlaylist = async (id: string) => {
        try {
            const response = await fetch('/api/playlists/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setPlaylists(playlists.filter((playlist) => playlist.id !== id));
                console.log('Playlist deleted successfully');
            } else {
                const errorData = await response.json();
                console.log(errorData.error || 'Failed to delete playlist');
            }
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    return (
        <section>
            <h2>Add New Playlist</h2>
            <Input
                type="text"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="mt-2 p-2 w-full"
            />
            <Button
                onClick={createPlaylist}
                className="mt-4 py-2 px-4"
            >
                Create Playlist
            </Button>

            <div className="mt-4">
                <h3>Your Playlists:</h3>
                <ul>
                    {playlists.map((playlist) => (
                        <li key={playlist.id} className="mt-2 p-2 flex justify-between">
                            <p className='flex items-center'>{playlist.name}</p>
                            <Button
                                onClick={() => deletePlaylist(playlist.id)}
                                className="bg-red-500 hover:bg-red-700"
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={onClose} className="absolute top-3 right-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </section>

    );
};

export default PlaylistModal;
