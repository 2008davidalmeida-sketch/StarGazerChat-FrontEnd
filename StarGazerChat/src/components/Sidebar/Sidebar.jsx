import './Sidebar.css';
import Logo from '../../assets/Logo.png';
import messageIcon from '../../assets/messageIcon.svg';
import bellIcon from '../../assets/bell.svg';
import trashIcon from '../../assets/trash.svg';
import personIcon from '../../assets/person.svg';

export default function Sidebar({ activeView, setActiveView }) {
    

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img className="sidebar-logo-img" src={Logo} alt="Logo" />
            </div>
            <div className="sidebar-icons">
                <button 
                    className={activeView === 'chats' ? 'sidebar-btn active' : 'sidebar-btn'}
                    onClick={() => setActiveView('chats')}
                >
                    <img className="icon" src={messageIcon} alt="Messages" />
                </button>
                <button 
                    className={activeView === 'notifications' ? 'sidebar-btn active' : 'sidebar-btn'}
                    onClick={() => setActiveView('notifications')}
                >
                    <img className="icon" src={bellIcon} alt="Notifications" />
                </button>
                <button 
                    className={activeView === 'trash' ? 'sidebar-btn active' : 'sidebar-btn'}
                    onClick={() => setActiveView('trash')}
                >
                    <img className="icon" src={trashIcon} alt="Trash" />
                </button>
            </div>
            <div className="sidebar-bottom">
                <button 
                    className={activeView === 'profile' ? 'sidebar-btn active' : 'sidebar-btn'}
                    onClick={() => setActiveView('profile')}
                >
                    <img className="icon" src={personIcon} alt="Profile" />
                </button>
            </div>
        </div>
    );
}