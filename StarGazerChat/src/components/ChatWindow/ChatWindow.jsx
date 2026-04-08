import './ChatWindow.css';
import sendIcon from '../../assets/send-fill.svg';

export default function ChatWindow({ room }) {
    if (!room) {
        return (
            <div className="chat-window empty">
                <p>Select a conversation to start chatting</p>
            </div>
        );
    }

    const messages = [
        { id: 1, content: 'Atao mareeeee', sender: 'other', time: '5:10 PM' },
        { id: 2, content: 'Sou lindo 🗿🗿', sender: 'me', time: '5:11 PM' },
        { id: 3, content: 'Lindo é o Ronaldo', sender: 'other', time: '5:12 PM' },
        { id: 4, content: 'Sou lindo 🗿🗿', sender: 'me', time: '5:13 PM' },
        { id: 5, content: 'Lindo é o Ronaldo', sender: 'other', time: '5:14 PM' },
        { id: 6, content: 'Sou lindo 🗿🗿', sender: 'me', time: '5:15 PM' },
        { id: 7, content: 'Lindo é o Ronaldo', sender: 'other', time: '5:16 PM' },
    ];

    return (
        <div className="chat-window">
            <div className="chat-window-header">
                <div className="chat-window-user">
                    <div className="chat-window-avatar">{room.name.charAt(0)}</div>
                    <div>
                        <h3>{room.name}</h3>
                        <span className="chat-window-status">Online</span>
                    </div>
                </div>
                <div className="chat-window-actions">
                    <button>Profile</button>
                </div>
            </div>

            <div className="chat-window-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender === 'me' ? 'message-me' : 'message-other'}`}>
                        <div className="message-bubble">
                            <p>{msg.content}</p>
                            <span className="message-time">{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat-window-input">
                <input type="text" placeholder="Write a message..." />
                <button className="send-btn">
                    <img src={sendIcon} alt="Send" className='send-icon'/>
                </button>
            </div>
        </div>
    );
}