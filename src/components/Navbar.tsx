"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import { useAuth } from '../context/AuthContext';

interface AuthButtonsProps {
    showRegisterPopup: boolean;
    setShowRegisterPopup: React.Dispatch<React.SetStateAction<boolean>>;
    showLoginPopup: boolean;
    setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<AuthButtonsProps> = ({ showRegisterPopup, setShowRegisterPopup, showLoginPopup, setShowLoginPopup }) => {
    const { data: session, status } = useSession();
    const { isLoggedIn, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        signOut();
    };


    console.log("Session:", session);
    console.log("Status:", status);

    return (
        <nav className="p-4 flex justify-between gap-4">
            <div>
                <a href="/">Home</a>
            </div>
            <div className='flex justify-end gap-4 flex-wrap'>
                {status === 'loading' ? (
                    <p>Loading...</p>
                ) : session ? (
                    <>

                        <div className='flex gap-1 text-end'><p className="xss:hidden xs:block">Welcome,</p> <p>{session.user?.name || 'User'}!</p></div>
                        <button className='flex justify-end' onClick={handleLogout}>Sign out</button>
                    </>
                ) : isLoggedIn ? (
                    <>
                        <div className='flex gap-1 text-end'><p className="xss:hidden xs:block">Welcome,</p> <p>{user?.name || 'User'}!</p></div>
                        <button className='flex justify-end' onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className='text-end' onClick={() => setShowRegisterPopup(true)}>Register</button>
                        <button className='text-end' onClick={() => setShowLoginPopup(true)}>Login</button>
                        <button className='text-end' onClick={() => signIn('google')}>Sign in with Google</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
