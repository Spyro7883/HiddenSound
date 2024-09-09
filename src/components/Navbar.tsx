"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import { useAuth } from '../context/AuthContext';
import { ModeToggle } from './ModeToggle';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
        <nav className="p-4 flex justify-between items-center gap-4">

            <div>
                <a href="/">Home</a>
            </div>
            <div className='flex justify-end items-center gap-4 flex-wrap'>
                {status === 'loading' ? (
                    <p>Loading...</p>) :
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">My Account</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel className='flex flex-wrap'>
                                {`Welcome, ${session ? session.user?.name : isLoggedIn ? user?.name : "user"}`}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {session || isLoggedIn ? (
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        {session ? "Sign out" : isLoggedIn ? "Logout" : ""}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            ) : (
                                <>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => setShowRegisterPopup(true)}>Register</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => setShowLoginPopup(true)}>Login</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => signIn('google')}>Sign in with Google</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
                <div>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
