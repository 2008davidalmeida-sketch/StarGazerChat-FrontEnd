import './LoginForm.css';
import { useState } from 'react';
import { login as loginService } from '../../services/auth.js';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            navigate('/chat', { replace: true });
        }
    }, [token, navigate]);

    async function handleSubmit() {

        setUsernameError('');
        setPasswordError('');

        if (!username) return setUsernameError('Username is required');
        if (!password) return setPasswordError('Password is required');

        try {
            const response = await loginService(username, password);
            console.log('Login response:', response);

            if (response.token) {
                login(response.token);
                navigate('/chat');
            } else if (response.message === 'User does not exist') {
                setUsername('');
                setUsernameError('User does not exist');
            } else if (response.message === 'Incorrect password') {
                setPassword('');
                setPasswordError('Incorrect password');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome Back!</h1>
                <p>Login to continue chatting</p>

                <div className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder={usernameError || "Enter your username"}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={usernameError ? 'input-error' : ''}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder={passwordError || "Enter your password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={passwordError ? 'input-error' : ''}
                        />
                    </div>
                    <button className="login-btn" onClick={handleSubmit}>
                        Login
                    </button>
                    <p className="register-link">
                        Don't have an account? <a href="/signup">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
}