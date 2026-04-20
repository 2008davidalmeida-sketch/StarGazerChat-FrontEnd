import './ChatPage.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { io } from 'socket.io-client';
import { BASE_URL } from '../../config.js';
import { getRooms, updateLastSeen } from '../../services/rooms.js';
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

    // Track the selected room in a ref for socket handlers
    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    // Phase 1: Fetch initial rooms centrally
    useEffect(() => {
        if (!token || !currentUser) return;

        getRooms(token).then(data => {
            console.log('Central rooms fetch:', data);
            if (Array.isArray(data)) {
                const processed = data.map(room => {
                    const myMembership = room.members?.find(m => m._id === currentUser.id);
                    const lastSeen = myMembership?.lastSeen ? new Date(myMembership.lastSeen).getTime() : 0;
                    const lastMessageTime = room.lastMessage?.createdAt ? new Date(room.lastMessage.createdAt).getTime() : 0;

                    return {
                        ...room,
                        unreadCount: room.unreadCount ?? (lastMessageTime > lastSeen ? 1 : 0)
                    };
                }).sort((a, b) => {
                    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
                    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
                    return timeB - timeA;
                });
                setRooms(processed);
            }
        });
    }, [token, refreshTrigger, currentUser]);

    // Phase 2: Handle Socket Connection and Real-time messaging
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
            // Auto-join the new room so we get its messages immediately
            s.emit('joinRoom', room._id);
            
            setRooms(prev => {
                const exists = prev.find(r => r._id === room._id);
                return exists ? prev : [room, ...prev];
            });
        });

        // Handle incoming messages to update meta-data (previews, unread counts, sorting)
        s.on('newMessage', (message) => {
            // Defensive ID extraction
            const messageRoomId = (message.room?._id || message.room)?.toString();
            
            setRooms(prev => {
                const updatedRooms = prev.map(room => {
                    if (room._id === messageRoomId) {
                        return {
                            ...room,
                            lastMessage: message,
                            // Increment unread unless the user is actively in this room
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

    // Phase 3: Auto-Join all rooms when socket and rooms are ready
    useEffect(() => {
        if (!socket || rooms.length === 0) return;
        
        console.log('Auto-joining rooms...');
        rooms.forEach(room => {
            socket.emit('joinRoom', room._id);
        });
    }, [socket, rooms.length]); // Only run when socket connects or room count changes

    async function handleRoomSelect(room) {
        // Set the selected room
        setSelectedRoom(room);
        
        // Update the last seen time for the selected room
        await updateLastSeen(token, room._id);
        
        // Immediate UI feedback: clear unread count for this room
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