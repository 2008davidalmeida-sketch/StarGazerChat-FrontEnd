import './ProfileWindow.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx'; 

export default function ProfileWindow() {
    // const { logout } = useContext(AuthContext); // Uncomment when ready

    // Placeholder data
    const user = {
        username: "Davisss",
        bio: "Nao acredites na mentira ela não é verdade 🗿🗿🗿",
        joinDate: "April 2026"
    };

    return (
        <div className="profile-window-wrapper">
            <div className="profile-window-container">
                <div className="profile-window-content">
                    <div className="profile-window-avatar">
                        {user.username.charAt(0)}
                    </div>

                    <h3 className="profile-window-username">{user.username}</h3>
                    <p className="profile-window-bio">{user.bio}</p>
                    <p className="profile-window-date">Joined {user.joinDate}</p>

                    <div className="profile-window-actions">
                        <button className="profile-window-btn profile-window-btn-outline">
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
                        // onClick={() => logout()} // Uncomment when ready
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
