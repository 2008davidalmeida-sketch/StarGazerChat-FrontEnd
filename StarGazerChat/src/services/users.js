import { BASE_URL } from '../config.js';

// Search users service
export async function searchUsers(token, query) {
    // Call the backend GET /users/search endpoint
    const response = await fetch(`${BASE_URL}/users/search?q=${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

// Get me service
export async function getMe(token) {
    // Call the backend GET /users/me endpoint
    const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Update profile service
export async function updateProfile(token, profileData) {
    // Call the backend PATCH /users/me endpoint
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

// Change password service
export async function changePassword(token, { currentPassword, newPassword }) {
    // Call the backend PATCH /users/password endpoint
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
