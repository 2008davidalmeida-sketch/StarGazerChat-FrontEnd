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