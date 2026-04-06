import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);

    function login(token) {
        console.log('Token saved:', token);
        setToken(token);
    }

    function logout() { 
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, setToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}