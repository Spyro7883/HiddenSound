"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
    id: string;
    name: string;
}

interface AuthContextProps {
    isLoggedIn: boolean;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check localStorage to see if the user is logged in and retrieve user info
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const storedUser = localStorage.getItem('user');
        setIsLoggedIn(loggedIn);
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    const login = (user: User) => {
        setIsLoggedIn(true);
        setUser(user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));

        // Set userId in a cookie for server-side access
        document.cookie = `userId=${user.id}; path=/; SameSite=Lax; Secure`;
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');

        // Clear the userId cookie
        document.cookie = 'userId=; Max-Age=0; path=/;';
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
