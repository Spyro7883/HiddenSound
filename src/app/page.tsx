"use client"
import LoginPopup from '@/components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup'
import { useState } from "react"
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { data: session } = useSession();
  return (
    <div>
      <Navbar></Navbar>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className='flex flex-col justify-center'>
          {showRegisterPopup && <RegisterPopup />}
          {showLoginPopup && <LoginPopup />}
          <div className='flex min-w-40 justify-around items-center'>
            {/* Render the Register button only if LoginPopup is not shown, same logic for Login Button */}
            {!showLoginPopup && <button onClick={() => setShowRegisterPopup(!showRegisterPopup)}>{showRegisterPopup ? 'Close Popup' : 'Register'}</button>}
            {!showRegisterPopup && <button onClick={() => setShowLoginPopup(!showLoginPopup)}>{showLoginPopup ? 'Close Popup' : 'Login'}</button>}

          </div>
        </div>

      </main>
    </div>
  )
}
