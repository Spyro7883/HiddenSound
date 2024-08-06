"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextProps {
    isLoggedIn: boolean;
    user: { name: string } | null;
    login: (user: { name: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        // Check localStorage to see if the user is logged in and retrieve user info
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const storedUser = localStorage.getItem('user');
        setIsLoggedIn(loggedIn);
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    const login = (user: { name: string }) => {
        setIsLoggedIn(true);
        setUser(user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
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
