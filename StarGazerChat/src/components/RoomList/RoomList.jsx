import './RoomList.css';
import addIcon from '../../assets/plus-circle-fill.svg';

export default function RoomList({ onRoomSelect }) {
    const rooms = [
        { id: 1, name: 'Zé Peter', lastMessage: 'olá cubano', time: '10:27 AM', unread: 1 },
        { id: 2, name: 'Pirezaço', lastMessage: 'Sou Gay...', time: '9:48 AM', unread: 0 },
        { id: 3, name: 'Montanelas', lastMessage: 'Boa lasanha sim senhor.', time: '10:32 AM', unread: 0 },
        { id: 4, name: 'Zé Peter', lastMessage: 'olá cubano', time: '10:27 AM', unread: 1 },
        { id: 5, name: 'Pirezaço', lastMessage: 'Sou Gay...', time: '9:48 AM', unread: 0 },
        { id: 6, name: 'Montanelas', lastMessage: 'Boa lasanha sim senhor.', time: '10:32 AM', unread: 0 },
        { id: 7, name: 'Zé Peter', lastMessage: 'olá cubano', time: '10:27 AM', unread: 1 },
        { id: 8, name: 'Pirezaço', lastMessage: 'Sou Gay...', time: '9:48 AM', unread: 0 },
        { id: 9, name: 'Montanelas', lastMessage: 'Boa lasanha sim senhor.', time: '10:32 AM', unread: 0 },
    ];

    return (
        <div className="room-list">
            <div className="room-list-header">
                <h2>Chat</h2>
                <div className="room-list-actions">
                    <input type="text" placeholder="Search..." className="room-search" />
                    <button className="room-add-btn">
                        <img src={addIcon} alt="Add Room" className='addIcon'/>
                    </button>
                </div>
            </div>
            <div className="room-list-items">
                {rooms.map(room => (
                    <div 
                        key={room.id} 
                        className="room-item"
                        onClick={() => onRoomSelect(room)}
                    >
                        <div className="room-avatar">
                            {room.name.charAt(0)}
                        </div>
                        <div className="room-info">
                            <div className="room-top">
                                <span className="room-name">{room.name}</span>
                                <span className="room-time">{room.time}</span>
                            </div>
                            <div className="room-bottom">
                                <span className="room-last-message">{room.lastMessage}</span>
                                {room.unread > 0 && <span className="room-unread">{room.unread}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}