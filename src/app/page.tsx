"use client"
import LoginPopup from '@/components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup'
import { useState } from "react"
import Navbar from '@/components/Navbar';

export default function Home() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
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

      </main>
    </div>
  )
}
