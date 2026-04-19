import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getMe, updateProfile } from '../../services/users';
import './EditProfilePage.css';
import arrowIcon from '../../assets/arrowIcon.svg';

export default function EditProfilePage() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch user data to pre-populate the form
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        // Call the getMe service to get the user's data
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

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // Call the updateProfile service to update the user's profile
        const result = await updateProfile(token, { username, bio });
        if (result.message) {
            setError(result.message); // e.g. "Username already taken"
            return;
        }
        // Navigate back to the profile tab upon success
        navigate('/chat', { state: { activeView: 'profile' } });
    };

    // Show loading state while fetching user data
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
                        {error && <p style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}
                        <button type="submit" className="edit-profile-btn save-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
