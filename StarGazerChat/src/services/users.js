import { BASE_URL } from '../config.js';

export async function searchUsers(token, query) {
    const response = await fetch(`${BASE_URL}/users/search?q=${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

export async function getMe(token) {
    const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}