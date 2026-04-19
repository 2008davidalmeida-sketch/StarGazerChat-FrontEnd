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
import { Navigate, useLocation } from 'react-router-dom';

export default function ChatPage() {
    const { token, currentUser } = useContext(AuthContext);
    const location = useLocation();
    const [activeView, setActiveView] = useState(location.state?.activeView || 'chats');
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

        // Connect to the socket server
        const socket = io(BASE_URL, { auth: { token } });
        socketRef.current = socket;

        // Handle socket connection
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        // Handle new room event
        socket.on('newRoom', (room) => {
            console.log('newRoom received:', room);
            setRooms(prev => {
                const exists = prev.find(r => r._id === room._id);
                return exists ? prev : [room, ...prev];
            });
        });

        // Handle room deleted event
        socket.on('roomDeleted', ({ roomId }) => {
            console.log('roomDeleted received:', roomId);
            setRooms(prev => prev.filter(r => r._id !== roomId.toString()));
            if (selectedRoomRef.current?._id === roomId.toString()) {
                setSelectedRoom(null);
            }
        });

        // Disconnect from the socket server when the component unmounts
        return () => socket.disconnect();
    }, [token]);

    async function handleRoomSelect(room) {
        // Set the selected room
        setSelectedRoom(room);
        
        // Update the last seen time for the selected room
        await updateLastSeen(token, room._id);
        
        // Clear the unread count for the selected room
        setRooms(prev => prev.map(r =>
            r._id === room._id ? { ...r, unreadCount: 0 } : r
        ));
    }

    function handleRoomDelete(roomId) {
        // Clear the selected room
        setSelectedRoom(null);
        
        // Trigger a refresh of the room list
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
                            selectedRoom={selectedRoom}
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