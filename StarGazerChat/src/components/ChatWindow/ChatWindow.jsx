import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { BASE_URL } from '../../config.js';
import { deleteRoom } from '../../services/rooms.js';
import './ChatWindow.css';
import sendIcon from '../../assets/send-fill.svg';

function getDisplayName(room, currentUserId) {
    const other = room.members?.find(m => m._id !== currentUserId);
    return other?.username ?? room.name;
}

export default function ChatWindow({ room, currentUserId, onRoomDelete, socket }) {
    const { token } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const bottomRef = useRef(null);
    const targetUserIdRef = useRef(null);
    const [otherStatus, setOtherStatus] = useState('offline');

    useEffect(() => {
        if (!room) return;
        const other = room.members?.find(m => m._id !== currentUserId);
        targetUserIdRef.current = other?._id;
        setOtherStatus(other?.status || 'offline');
    }, [room, currentUserId]);

    useEffect(() => {
        if (!room || !token) return;
        setMessages([]);
        fetch(`${BASE_URL}/messages/${room._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
            });
    }, [room]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socket.on('userStatus', ({ userId, status }) => {
            if (targetUserIdRef.current === userId) {
                setOtherStatus(status);
            }
        });

        return () => {
            socket.off('newMessage');
            socket.off('userStatus');
        };
    }, [socket]);

    useEffect(() => {
        if (!room || !socket) return;
        socket.emit('joinRoom', room._id);
    }, [room, socket]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function handleSend() {
        if (!input.trim() || !room || !socket) return;
        socket.emit('sendMessage', { roomId: room._id, content: input.trim() });
        setInput('');
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSend();
    }

    async function handleDelete() {
        if (!room) return;
        await deleteRoom(token, room._id);
        setShowDeleteModal(false);
        onRoomDelete(room._id);
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