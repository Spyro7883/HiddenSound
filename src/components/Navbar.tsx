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
        <nav style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <a href="/">Home</a>
                {/* Add other navigation links here */}
            </div>
            <div className='flex gap-4'>
                {status === 'loading' ? (
                    <p>Loading...</p>
                ) : session ? (
                    <>
                        <p>Welcome, {session.user?.name || 'User'}!</p>
                        <button onClick={handleLogout}>Sign out</button>
                    </>
                ) : isLoggedIn ? (
                    <>
                        <p>Welcome, {user?.name || 'User'}!</p>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setShowRegisterPopup(true)}>Register</button>
                        <button onClick={() => setShowLoginPopup(true)}>Login</button>
                        <button onClick={() => signIn('google')}>Sign in with Google</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
