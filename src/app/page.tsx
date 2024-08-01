"use client"
import RegisterPopup from './RegisterPopup'
import { useState } from "react"

export default function Home() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"> */}
      <div className='flex flex-col justify-center'>
        {showRegisterPopup ? <RegisterPopup /> : <></>}
        <div className='flex min-w-40 justify-around items-center'>
          <button onClick={() => setShowRegisterPopup(!showRegisterPopup)}>{!showRegisterPopup ? 'Register' : 'Close Popup'}</button>
          <button onClick={() => setShowLoginPopup(!showLoginPopup)}>{!showLoginPopup ? 'Login' : 'Close Popup'}</button>
        </div>
      </div>
    </main>
  )
}
