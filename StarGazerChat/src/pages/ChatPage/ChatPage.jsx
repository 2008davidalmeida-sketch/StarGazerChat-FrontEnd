import './ChatPage.css';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import RoomList from '../../components/RoomList/RoomList.jsx';
import ChatWindow from '../../components/ChatWindow/ChatWindow.jsx';
import ProfileWindow from '../../components/ProfileWindow/ProfileWindow.jsx';
import { Navigate } from 'react-router-dom';

export default function ChatPage() {
    const { currentUser } = useContext(AuthContext);
    const [activeView, setActiveView] = useState('chats');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="chat-page-wrapper">
            <div className="chat-page">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />
                {activeView === 'chats' && (
                <>
                    <RoomList
                        onRoomSelect={(room) => setSelectedRoom(room)}
                        currentUserId={currentUser?.id}
                        refreshTrigger={refreshTrigger}
                    />
                    <ChatWindow
                        room={selectedRoom}
                        currentUserId={currentUser?.id}
                        onRoomDelete={() => {
                            setSelectedRoom(null);
                            setRefreshTrigger(prev => prev + 1);
                        }}
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