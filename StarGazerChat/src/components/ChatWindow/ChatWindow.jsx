import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { BASE_URL } from '../../config.js';
import { deleteRoom } from '../../services/rooms.js';
import './ChatWindow.css';
import sendIcon from '../../assets/send-fill.svg';


export default function ChatWindow({ room, currentUserId, onRoomDelete, socket }) {
    const { token } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const bottomRef = useRef(null);
    const targetUserIdRef = useRef(null);
    const [otherStatus, setOtherStatus] = useState('offline');

    // Effect 1: Refresh the other user's status when the room changes
    useEffect(() => {
        if (!room) return;

        // Find the other user in the room
        const other = room.members?.find(m => m._id !== currentUserId);

        // Update the target user ID and their status
        targetUserIdRef.current = other?._id;
        setOtherStatus(other?.status || 'offline');
    }, [room, currentUserId]);

    // Effect 2: Fetch the complete message history from the backend whenever a new room is clicked
    useEffect(() => {
        if (!room || !token) return;
        setMessages([]);

        // Fetch the complete message history from the backend
        fetch(`${BASE_URL}/messages/${room._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json()) // Convert the response to JSON
            .then(data => {
                // Update the messages state with the fetched data
                if (Array.isArray(data)) setMessages(data);
            });
    }, [room]);

    // Effect 3: Listen for incoming chat messages and status updates
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            // Append incoming message to the local state so it appears on screen instantly
            if (message.room?.toString() === room?._id?.toString()) { // Check if the message belongs to the current room
               
                // Add the new message to the existing messages
                setMessages(prev => [...prev, message]); 
            }
        };

        const handleUserStatus = ({ userId, status }) => {
            // Only update the online/offline badge if the ping belongs to the person we are actively chatting with
            if (targetUserIdRef.current === userId) {
                setOtherStatus(status);
            }
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('userStatus', handleUserStatus);

        return () => {
            // Clean up the event listeners when the component unmounts
            socket.off('newMessage', handleNewMessage);
            socket.off('userStatus', handleUserStatus);
        };
    }, [socket, room]);

    // Effect 4: Tell the backend socket server that we joined this specific room
    useEffect(() => {
        if (!room || !socket) return;

        // Emit the joinRoom event to the backend
        socket.emit('joinRoom', room._id); 

        // Clean up the event listeners when the component unmounts
        return () => {
            socket.off('joinRoom');
        };
    }, [room, socket]);

    // Effect 5: Auto-scroll to the bottom of the chat view whenever messages update
    useEffect(() => {
        // Scroll to the bottom of the chat view
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function handleSend() {
        // Send the message to the backend
        if (!input.trim() || !room || !socket) return;
        socket.emit('sendMessage', { roomId: room._id, content: input.trim() });
        setInput('');
    }

    function handleKeyDown(e) {
        // Send the message to the backend when the Enter key is pressed
        if (e.key === 'Enter') handleSend();
    }

    async function handleDelete() {
        // Delete the room from the backend
        if (!room) return;
        await deleteRoom(token, room._id);
        setShowDeleteModal(false);
        onRoomDelete(room._id);
    }

    function getDisplayName(room, currentUserId) {
        // Find the other user in the room
        const other = room.members?.find(m => m._id !== currentUserId);
        
        // Return the other user's username or the room name if no other user is found
        return other?.username ?? room.name;
    }

    if (!room) {
        return (
            <div className="chat-window empty">
                <p>Select a conversation to start chatting</p>
            </div>
        );
    }

    const displayName = getDisplayName(room, currentUserId);

    return (
        <div className="chat-window">
            <div className="chat-window-header">
                <div className="chat-window-user">
                    <div className="chat-window-avatar">{displayName.charAt(0)}</div>
                    <div>
                        <h3>{displayName}</h3>
                        {otherStatus === 'online' && <span className="chat-window-status">● Online</span>}
                    </div>
                </div>
                <div className="chat-window-actions">
                    <button>Profile</button>
                    <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>Delete</button>
                </div>
            </div>

            <div className="chat-window-messages">
                {messages.map((msg, i) => (
                    <div
                        key={msg._id ?? i}
                        className={`message ${msg.sender === currentUserId ? 'message-me' : 'message-other'}`}
                    >
                        <div className="message-bubble">
                            <p>{msg.content}</p>
                            <span className="message-time">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="chat-window-input">
                <input
                    type="text"
                    placeholder="Write a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="send-btn" onClick={handleSend}>
                    <img src={sendIcon} alt="Send" className='send-icon'/>
                </button>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Delete Conversation?</h3>
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.95rem' }}>
                            Are you sure you want to permanently delete this room with <b>{displayName}</b>? This action cannot be undone.
                        </p>
                        <div className="chat-modal-actions">
                            <button className="chat-modal-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="chat-modal-confirm" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}