import { BASE_URL } from '../config.js';

// Login service
export async function login(username, password) {
    // Call the backend POST /auth/login endpoint
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

// Register service
export async function register(username, password) {
    // Call the backend POST /auth/register endpoint
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}