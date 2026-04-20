import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getRooms, createRoom } from '../../services/rooms.js';
import { searchUsers } from '../../services/users.js';
import './RoomList.css';
import addIcon from '../../assets/plus-circle-fill.svg';


export default function RoomList({ onRoomSelect, currentUserId, refreshTrigger, socket, rooms, setRooms, selectedRoom }) {
    const { token } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [roomSearchQuery, setRoomSearchQuery] = useState('');
    // Debounced search for discovering new users
    useEffect(() => {
        if (!searchQuery.trim()) return setSearchResults([]);
        
        // Wait 300ms after the user stops typing before making the API request
        const timeout = setTimeout(() => {
            searchUsers(token, searchQuery).then(data => {
                if (Array.isArray(data)) setSearchResults(data);
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    async function handleSelectUser(user) {
        // Create a new room with the selected user
        const room = await createRoom(token, user.username);
        setShowModal(false);
        setSearchQuery('');
        setSearchResults([]);
        
        // Add the new room to the list of rooms
        if (room._id) {
            setRooms(prev => {
                const exists = prev.find(r => r._id === room._id);
                return exists ? prev : [room, ...prev];
            });
            onRoomSelect(room);
        }
    }

    function getRoomDisplayName(room) {
        // Find the other user in the room
        const other = room.members?.find(m => m._id !== currentUserId);
        
        // Return the other user's username or the room name if no other user is found
        return other?.username ?? room.name;
    }

    function getLastMessageText(room) {
        // Return the last message text or 'No messages yet...' if no last message is found
        if (!room.lastMessage) return 'No messages yet...';
        
        // Get the sender of the last message
        const sender = room.lastMessage.sender;
        const senderId = typeof sender === 'object' ? sender._id : sender;
        
        // Return the last message text
        if (senderId === currentUserId) {
            return `Me: ${room.lastMessage.content}`;
        }
        
        // Find the other user in the room
        const otherMember = room.members?.find(m => m._id === senderId);
        const name = otherMember?.username || 'User';
        return `${name}: ${room.lastMessage.content}`;
    }

    // Filter rooms based on the local search query
    const filteredRooms = rooms.filter(room => 
        getRoomDisplayName(room).toLowerCase().includes(roomSearchQuery.toLowerCase())
    );

    return (
        <div className="room-list">
            <div className="room-list-header">
                <h2>Chat</h2>
                <div className="room-list-actions">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="room-search" 
                        value={roomSearchQuery}
                        onChange={(e) => setRoomSearchQuery(e.target.value)}
                    />
                    <button className="room-add-btn" onClick={() => setShowModal(true)}>
                        <img src={addIcon} alt="Add Room" className='addIcon'/>
                    </button>
                </div>
            </div>

            <div className="room-list-items">
                {filteredRooms.length === 0 ? (
                    <div className="no-rooms-message" style={{ textAlign: "center", marginTop: "2rem", color: "#666" }}>
                       {roomSearchQuery ? "No chats found." : "No chats yet. Start a new one!"}
                    </div>
                ) : (
                    filteredRooms.map(room => (
                    <div
                        key={room._id}
                        className="room-item"
                        onClick={() => onRoomSelect(room)}
                    >
                        <div className="room-avatar">
                            {getRoomDisplayName(room).charAt(0)}
                        </div>
                        <div className="room-info">
                            <div className="room-top">
                                <span className="room-name">{getRoomDisplayName(room)}</span>
                                {room.lastMessage && (
                                    <span className="room-time">
                                        {new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            <div className="room-bottom">
                                <span className="room-last-message">
                                    {getLastMessageText(room)}
                                </span>
                               {room.unreadCount > 0 && <span className="room-unread">{room.unreadCount}</span>}
                            </div>
                        </div>
                    </div>
                )))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>New Chat</h3>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <div className="modal-results">
                            {searchResults.map(user => (
                                <div
                                    key={user._id}
                                    className="modal-result-item"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <div className="room-avatar">{user.username.charAt(0)}</div>
                                    <span>{user.username}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}