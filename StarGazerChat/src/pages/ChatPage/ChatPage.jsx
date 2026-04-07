import './ChatPage.css';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import RoomList from '../../components/RoomList/RoomList.jsx';
import ChatWindow from '../../components/ChatWindow/ChatWindow.jsx';


export default function ChatPage() {
    const [activeView, setActiveView] = useState('chats');
    const [selectedRoom, setSelectedRoom] = useState(null);

    return (
        <div className="chat-page-wrapper">
            <div className="chat-page">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />
                {activeView === 'chats' && (
                    <RoomList onRoomSelect={(room) => setSelectedRoom(room)} />
                )}
                <ChatWindow room={selectedRoom} />
            </div>
        </div>
    );
}