import './ProfileWindow.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../services/users.js';

export default function ProfileWindow() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) return;
        getMe(token).then(data => {
            if (data._id) {
                setUser(data);
            }
        });
    }, [token]);

    const displayUser = user || { username: 'Loading...', bio: '', createdAt: new Date() };
    
    // Format date efficiently
    const joinDate = new Date(displayUser.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="profile-window-wrapper">
            <div className="profile-window-container">
                <div className="profile-window-content">
                    <div className="profile-window-avatar">
                        {displayUser.username.charAt(0).toUpperCase()}
                    </div>

                    <h3 className="profile-window-username">{displayUser.username}</h3>
                    <p className="profile-window-bio">{displayUser.bio || "No bio yet"}</p>
                    <p className="profile-window-date">Joined {joinDate}</p>

                    <div className="profile-window-actions">
                        <button 
                            className="profile-window-btn profile-window-btn-outline"
                            onClick={() => navigate('/edit-profile')}
                        >
                            Edit Profile
                        </button>
                        <button className="profile-window-btn profile-window-btn-outline">
                            Change Password
                        </button>
                        <button className="profile-window-btn profile-window-btn-outline">
                            Preferences
                        </button>
                        <div className="profile-window-divider"></div>
                        <button
                            className="profile-window-btn profile-window-btn-danger"
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }} 
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
