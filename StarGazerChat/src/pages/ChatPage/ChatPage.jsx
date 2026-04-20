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
    const [socket, setSocket] = useState(null);
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
        const s = io(BASE_URL, { auth: { token } });
        setSocket(s);

        // Handle socket connection
        s.on('connect', () => {
            console.log('Socket connected:', s.id);
        });

        // Handle new room event
        s.on('newRoom', (room) => {
            console.log('newRoom received:', room);
            setRooms(prev => {
                const exists = prev.find(r => r._id === room._id);
                return exists ? prev : [room, ...prev];
            });
        });

        // Handle incoming messages to update meta-data (previews, unread counts, sorting)
        s.on('newMessage', (message) => {
            const messageRoomId = message.room?.toString();
            
            setRooms(prev => {
                const updatedRooms = prev.map(room => {
                    if (room._id === messageRoomId) {
                        return {
                            ...room,
                            lastMessage: message,
                            // If the chat window is closed or focusing another room, increment unread count
                            unreadCount: selectedRoomRef.current?._id === room._id
                                ? 0
                                : (room.unreadCount || 0) + 1
                        };
                    }
                    return room;
                });

                // Robust sort: Recently active chats always move to the top
                return [...updatedRooms].sort((a, b) => {
                    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
                    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
                    return timeB - timeA;
                });
            });
        });

        // Handle room deleted event
        s.on('roomDeleted', ({ roomId }) => {
            console.log('roomDeleted received:', roomId);
            setRooms(prev => prev.filter(r => r._id !== roomId.toString()));
            if (selectedRoomRef.current?._id === roomId.toString()) {
                setSelectedRoom(null);
            }
        });

        // Disconnect from the socket server when the component unmounts
        return () => {
            s.disconnect();
            setSocket(null);
        };
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
                            socket={socket}
                            rooms={rooms}
                            setRooms={setRooms}
                            selectedRoom={selectedRoom}
                        />
                        <ChatWindow
                            room={selectedRoom}
                            currentUserId={currentUser?.id}
                            socket={socket}
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