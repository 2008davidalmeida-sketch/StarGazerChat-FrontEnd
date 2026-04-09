import { BASE_URL } from '../config.js';

export async function getRooms(token) {
    const response = await fetch(`${BASE_URL}/rooms`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

export async function createRoom(token, targetUsername) {
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

export async function deleteRoom(token, roomId) {
    const response = await fetch(`${BASE_URL}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

export async function updateLastSeen(token, roomId) {
    const response = await fetch(`${BASE_URL}/rooms/${roomId}/lastSeen`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}