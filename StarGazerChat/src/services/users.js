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

export async function updateProfile(token, profileData) {
    const response = await fetch(`${BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    });
    return response.json();
}

export async function changePassword(token, { currentPassword, newPassword }) {
    const response = await fetch(`${BASE_URL}/users/password`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });
    return response.json();
}
