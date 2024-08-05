"use client";

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session, status } = useSession();

    console.log("Session:", session);
    console.log("Status:", status);

    return (
        <nav style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <a href="/">Home</a>
                {/* Add other navigation links here */}
            </div>
            <div>
                {status === 'loading' ? (
                    <p>Loading...</p>
                ) : !session ? (
                    <button onClick={() => signIn('google')}>Sign in with Google</button>
                ) : (
                    <button onClick={() => signOut()}>Sign out</button>
                )}
            </div>
        </nav>
    );
}
