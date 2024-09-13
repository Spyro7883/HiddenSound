"use client"
import LoginPopup from '@/components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup'
import Navbar from '@/components/Navbar';
import YouTubePlayer from '@/components/YoutubePlayer';
import YouTubeSearch from '@/components/YoutubeSearch';
import YouTubePlaylist from '@/components/YoutubePlaylist';

import { useState, useEffect } from "react"
import { useSession } from 'next-auth/react';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Home() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Array<{ id: string, name: string }>>([]);

  const { data: session, } = useSession();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchUserIdAndPlaylists = async () => {
      try {
        const userIdResponse = await fetch('/api/getUserId');
        const userIdData = await userIdResponse.json();
        const userId = userIdData.userId;

        if (userId) {
          const playlistsResponse = await fetch(`/api/playlists/getAllPlaylists?userId=${userId}`);
          const playlistsData = await playlistsResponse.json();
          setPlaylists(playlistsData);
        }
      } catch (error) {
        console.error('Error fetching user ID or playlists:', error);
      }
    };

    if (session || isLoggedIn) {
      fetchUserIdAndPlaylists();
    }
  }, [session, isLoggedIn]);

  const handleVideoSelect = (id: string) => {
    setVideoId(id);
    setSelectedPlaylistId(null);
  };
  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setVideoId(null);
  };

  return (
    <div>
      <Navbar showRegisterPopup={showRegisterPopup}
        setShowRegisterPopup={setShowRegisterPopup}
        showLoginPopup={showLoginPopup}
        setShowLoginPopup={setShowLoginPopup}></Navbar>
      <main className={`flex flex-col h-90svh items-center gap-8 ${(session || isLoggedIn) ? "justify-between" : "justify-center"} p-8`}>
        {!(session || isLoggedIn) ? (

          <div className="flex flex-col justify-center">

            <Dialog
              open={showRegisterPopup}
              onOpenChange={setShowRegisterPopup}
            >
              <DialogTrigger asChild>
                <div />
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Registration</DialogTitle>
                  <DialogDescription>
                    Create an account
                  </DialogDescription>
                </DialogHeader>
                <RegisterPopup onClose={() => setShowRegisterPopup(false)} />
              </DialogContent>

            </Dialog>
            <Dialog
              open={showLoginPopup}
              onOpenChange={setShowLoginPopup}
            >
              <DialogTrigger asChild>
                <div />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Login</DialogTitle>
                  <DialogDescription>
                    Log through your own account
                  </DialogDescription>
                </DialogHeader>
                <LoginPopup onClose={() => setShowLoginPopup(false)} />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div>
            <YouTubeSearch onVideoSelect={handleVideoSelect} />
            <div className="mt-4 xss:text-center xs:text-start">
              <h2>Select a Playlist to Play:</h2>
              <ul>
                {playlists.map((playlist) => (
                  <li key={playlist.id}>
                    <button onClick={() => handlePlaylistSelect(playlist.id)}>
                      {playlist.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
        }
        {
          session || isLoggedIn ? (
            selectedPlaylistId ? (
              <YouTubePlaylist playlistId={selectedPlaylistId} />
            ) : (
              videoId && <YouTubePlayer videoId={videoId} />
            )
          ) : (
            <p className='d-flex justify-center text-center'>Please log in to use our hidden music player.</p>
          )
        }
      </main >
    </div >
  )
}
