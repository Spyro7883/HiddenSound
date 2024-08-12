"use client"
import LoginPopup from '@/components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup'
import Navbar from '@/components/Navbar';
import YouTubePlayer from '@/components/YoutubePlayer';

import { useState } from "react"
import { useSession } from 'next-auth/react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { data: session, } = useSession();
  const { isLoggedIn } = useAuth();

  const [url, setUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handlePlay = () => {
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      console.error('Invalid YouTube URL');
    }
  };
  return (
    <div>
      <Navbar showRegisterPopup={showRegisterPopup}
        setShowRegisterPopup={setShowRegisterPopup}
        showLoginPopup={showLoginPopup}
        setShowLoginPopup={setShowLoginPopup}></Navbar>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className='flex flex-col justify-center'>
          {showRegisterPopup && <RegisterPopup onClose={() => setShowRegisterPopup(false)} />}
          {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
        </div>
        {(session || isLoggedIn) ? <div>
          <h1>YouTube Music Player</h1>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube link"
            className="w-3/5 p-2 text-base rounded border border-gray-300 mr-2 bg-white text-black"
          />
          <button
            onClick={handlePlay}
            className="px-5 py-2 text-base rounded bg-blue-500 text-white border-none cursor-pointer"
          >
            {videoId ? 'Play' : 'Start'}
          </button>

          {videoId && <YouTubePlayer videoId={videoId} />}
        </div> : <p>Please log in to use our hidden music player.</p>}
      </main>
    </div>
  )
}
