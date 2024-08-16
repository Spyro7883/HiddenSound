import React, { useState, useEffect } from 'react';

interface PlaylistModalProps {
    onClose: () => void;
    accountId: string;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ onClose, accountId }) => {
    const [playlistName, setPlaylistName] = useState('');
    const [playlists, setPlaylists] = useState<Array<{ id: string, name: string }>>([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`/api/playlists/getAllPlaylists?accountId=${accountId}`);
                const data = await response.json();
                setPlaylists(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, [accountId]);

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
                body: JSON.stringify({ name: playlistName, accountId }),
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
                // Remove the deleted playlist from the state
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <section className="relative flex flex-col space-evenly w-96 h-48 rounded-lg bg-slate-700 p-4 m-8 inset-0">
                <h2>Add New Playlist</h2>
                <input
                    type="text"
                    placeholder="Enter playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="mt-2 p-2 w-full bg-gray-700 text-white rounded-md"
                />
                <button
                    onClick={createPlaylist}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                    Create Playlist
                </button>

                {/* Display the existing playlists */}
                <div className="mt-4">
                    <h3>Your Playlists:</h3>
                    <ul>
                        {playlists.map((playlist) => (
                            <li key={playlist.id} className="mt-2 p-2 bg-gray-600 rounded flex justify-between">
                                <p>{playlist.name}</p>
                                <button
                                    onClick={() => deletePlaylist(playlist.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </section>
        </div>
    );
};

export default PlaylistModal;
