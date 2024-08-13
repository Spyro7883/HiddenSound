"use client"
import LoginPopup from '@/components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup'
import Navbar from '@/components/Navbar';
import YouTubePlayer from '@/components/YoutubePlayer';
import YouTubeSearch from '@/components/YoutubeSearch';

import { useState } from "react"
import { useSession } from 'next-auth/react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { data: session, } = useSession();
  const { isLoggedIn } = useAuth();

  const [videoId, setVideoId] = useState<string | null>(null);

  const handleVideoSelect = (id: string) => {
    setVideoId(id);
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
            {showRegisterPopup && (
              <RegisterPopup onClose={() => setShowRegisterPopup(false)} />
            )}
            {showLoginPopup && (
              <LoginPopup onClose={() => setShowLoginPopup(false)} />
            )}
          </div>
        ) : (
          <div>
            <YouTubeSearch onVideoSelect={handleVideoSelect} />
          </div>
        )}
        {session || isLoggedIn ? (
          videoId && <YouTubePlayer videoId={videoId} />
        ) : (
          <p>Please log in to use our hidden music player.</p>
        )}
      </main>
    </div>
  )
}
