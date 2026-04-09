import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getRooms, createRoom } from '../../services/rooms.js';
import { searchUsers } from '../../services/users.js';
import './RoomList.css';
import addIcon from '../../assets/plus-circle-fill.svg';


export default function RoomList({ onRoomSelect, currentUserId, refreshTrigger, socket, rooms, setRooms }) {
    const { token } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!token) return;
        getRooms(token).then(data => {
            console.log('rooms fetched:', data);
            if (Array.isArray(data)) setRooms(data)
                
        });
    }, [token, refreshTrigger]);

    useEffect(() => {
        if (!searchQuery.trim()) return setSearchResults([]);
        const timeout = setTimeout(() => {
            searchUsers(token, searchQuery).then(data => {
                if (Array.isArray(data)) setSearchResults(data);
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            setRooms(prev => {
                const updatedRooms = prev.map(room => {
                    if (room._id === message.room?.toString()) {
                        return { ...room, lastMessage: message };
                    }
                    return room;
                });
                
                // Sort to bring the latest active room to the top
                return updatedRooms.sort((a, b) => {
                    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
                    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
                    return timeB - timeA;
                });
            });
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket]);

    async function handleSelectUser(user) {
        const room = await createRoom(token, user.username);
        setShowModal(false);
        setSearchQuery('');
        setSearchResults([]);
        if (room._id) {
            setRooms(prev => {
                const exists = prev.find(r => r._id === room._id);
                return exists ? prev : [room, ...prev];
            });
            onRoomSelect(room);
        }
    }

    function getRoomDisplayName(room) {
        const other = room.members?.find(m => m._id !== currentUserId);
        return other?.username ?? room.name;
    }

    function getLastMessageText(room) {
        if (!room.lastMessage) return 'No messages yet...';
        
        const sender = room.lastMessage.sender;
        const senderId = typeof sender === 'object' ? sender._id : sender;
        
        if (senderId === currentUserId) {
            return `Me: ${room.lastMessage.content}`;
        }
        
        const otherMember = room.members?.find(m => m._id === senderId);
        const name = otherMember?.username || 'User';
        return `${name}: ${room.lastMessage.content}`;
    }

    return (
        <div className="room-list">
            <div className="room-list-header">
                <h2>Chat</h2>
                <div className="room-list-actions">
                    <input type="text" placeholder="Search..." className="room-search" />
                    <button className="room-add-btn" onClick={() => setShowModal(true)}>
                        <img src={addIcon} alt="Add Room" className='addIcon'/>
                    </button>
                </div>
            </div>

            <div className="room-list-items">
                {rooms.map(room => (
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
                ))}
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