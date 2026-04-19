import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getMe } from '../../services/users';
import './EditProfilePage.css';
import arrowIcon from '../../assets/arrowIcon.svg';

export default function EditProfilePage() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        getMe(token).then(data => {
            if (data._id) {
                setUsername(data.username);
                setBio(data.bio || '');
            }
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, [token, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would implement the backend update call
        // For example: await updateProfile(token, { username, bio });
        console.log('Profile updated:', { username, bio });
        
        // After successful update, go back to chat page profile section
        navigate('/chat', { state: { activeView: 'profile' } });
    };

    if (isLoading) {
        return (
            <div className="edit-profile-page">
                <div className="edit-profile-card">
                    <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-card">
                <div className="edit-profile-card-header">
                    <button className="back-btn" onClick={() => navigate('/chat', { state: { activeView: 'profile' } })} aria-label="Go back">
                        <img src={arrowIcon} alt="Back" style={{ width: '24px', height: '24px' }} />
                    </button>
                    <h1>Edit Profile</h1>
                </div>

                <div className="edit-profile-avatar-section">
                    <div className="edit-profile-avatar">
                        {username ? username.charAt(0).toUpperCase() : '?'}
                        <div className="edit-profile-avatar-overlay">
                            Change
                        </div>
                    </div>
                </div>

                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    <div className="form-group-edit">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group-edit">
                        <label htmlFor="bio">Bio</label>
                        <textarea 
                            id="bio" 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us a little about yourself"
                            maxLength={160}
                        />
                    </div>

                    <div className="edit-profile-actions">
                        <button type="submit" className="edit-profile-btn save-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
