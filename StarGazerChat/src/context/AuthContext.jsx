import { createContext, useState } from 'react';

export const AuthContext = createContext();

function parseToken(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [currentUser, setCurrentUser] = useState(() => {
        const t = localStorage.getItem('token');
        return t ? parseToken(t) : null;
    });

    function login(token) {
        localStorage.setItem('token', token);
        setToken(token);
        setCurrentUser(parseToken(token));
    }

    function logout() {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}