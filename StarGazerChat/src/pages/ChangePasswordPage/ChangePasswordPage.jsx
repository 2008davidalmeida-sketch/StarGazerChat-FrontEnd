import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './ChangePasswordPage.css';
import arrowIcon from '../../assets/arrowIcon.svg';
import { changePassword } from '../../services/users';


export default function ChangePasswordPage() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        const result = await changePassword(token, { currentPassword, newPassword });

        if (result.message === 'Password updated successfully') {
            setSuccess(result.message);
            setTimeout(() => navigate('/chat', { state: { activeView: 'profile' } }), 1500);
        } else {
            setError(result.message);
        }
    }

    return (
        <div className="change-password-page">
            <div className="change-password-card">
                <div className="change-password-card-header">
                    <button
                        className="back-btn"
                        onClick={() => navigate('/chat', { state: { activeView: 'profile' } })}
                        aria-label="Go back"
                    >
                        <img src={arrowIcon} alt="Back" style={{ width: '24px', height: '24px' }} />
                    </button>
                    <h1>Change Password</h1>
                </div>

                <form className="change-password-form" onSubmit={handleSubmit}>
                    <div className="form-group-password">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter your current password"
                            required
                        />
                    </div>

                    <div className="form-group-password">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            required
                        />
                    </div>

                    <div className="form-group-password">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your new password"
                            required
                        />
                    </div>

                    <div className="change-password-actions">
                        {error && <p className="change-password-error">{error}</p>}
                        {success && <p className="change-password-success">{success}</p>}
                        <button type="submit" className="change-password-btn save-btn">
                            Save Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
