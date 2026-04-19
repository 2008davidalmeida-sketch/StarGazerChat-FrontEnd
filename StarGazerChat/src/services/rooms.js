import { BASE_URL } from '../config.js';

// Get rooms service
export async function getRooms(token) {
    // Call the backend GET /rooms endpoint
    const response = await fetch(`${BASE_URL}/rooms`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

// Create room service
export async function createRoom(token, targetUsername) {
    // Call the backend POST /rooms endpoint
    const response = await fetch(`${BASE_URL}/rooms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUsername })
    });
    return response.json();
}

// Delete room service
export async function deleteRoom(token, roomId) {
    // Call the backend DELETE /rooms/:roomId endpoint
    const response = await fetch(`${BASE_URL}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

// Update last seen service
export async function updateLastSeen(token, roomId) {
    // Call the backend PATCH /rooms/:roomId/lastSeen endpoint
    const response = await fetch(`${BASE_URL}/rooms/${roomId}/lastSeen`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}