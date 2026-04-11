import './ChatPage.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { io } from 'socket.io-client';
import { BASE_URL } from '../../config.js';
import { updateLastSeen } from '../../services/rooms.js';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import RoomList from '../../components/RoomList/RoomList.jsx';
import ChatWindow from '../../components/ChatWindow/ChatWindow.jsx';
import ProfileWindow from '../../components/ProfileWindow/ProfileWindow.jsx';
import { Navigate } from 'react-router-dom';

export default function ChatPage() {
    const { token, currentUser } = useContext(AuthContext);
    const [activeView, setActiveView] = useState('chats');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [rooms, setRooms] = useState([]);
    const socketRef = useRef(null);
    const selectedRoomRef = useRef(null);

    if (!token) {
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    useEffect(() => {
        if (!token) return;

        const socket = io(BASE_URL, { auth: { token } });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('newMessage', (message) => {
            console.log('New message:', message);
            setRooms(prev => prev.map(room => {
                if (room._id === message.room?.toString()) {
                    return {
                        ...room,
                        lastMessage: message,
                        unreadCount: selectedRoomRef.current?._id === room._id
                            ? 0
                            : (room.unreadCount || 0) + 1
                    };
                }
                return room;
            }));
        });

        socket.on('newRoom', (room) => {
            console.log('newRoom received:', room);
            setRooms(prev => {
                const exists = prev.find(r => r._id === room._id);
                return exists ? prev : [room, ...prev];
            });
        });

        socket.on('roomDeleted', ({ roomId }) => {
            console.log('roomDeleted received:', roomId);
            setRooms(prev => prev.filter(r => r._id !== roomId.toString()));
            if (selectedRoomRef.current?._id === roomId.toString()) {
                setSelectedRoom(null);
            }
        });

        return () => socket.disconnect();
    }, [token]);

    async function handleRoomSelect(room) {
        setSelectedRoom(room);
        await updateLastSeen(token, room._id);
        setRooms(prev => prev.map(r =>
            r._id === room._id ? { ...r, unreadCount: 0 } : r
        ));
    }

    function handleRoomDelete(roomId) {
        setSelectedRoom(null);
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <div className="chat-page-wrapper">
            <div className="chat-page">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />
                {activeView === 'chats' && (
                <>
                    <RoomList
                        onRoomSelect={handleRoomSelect}
                        currentUserId={currentUser?.id}
                        refreshTrigger={refreshTrigger}
                        socket={socketRef.current}
                        rooms={rooms}
                        setRooms={setRooms}
                    />
                    <ChatWindow
                        room={selectedRoom}
                        currentUserId={currentUser?.id}
                        socket={socketRef.current}
                        onRoomDelete={handleRoomDelete}
                    />
                </>
                )}
                {activeView === 'profile' && (
                    <ProfileWindow />
                )}
            </div>
        </div>
    );
}