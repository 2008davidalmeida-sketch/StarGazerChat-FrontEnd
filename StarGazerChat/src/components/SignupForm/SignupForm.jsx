import './SignupForm.css';
import { useState } from 'react';
import { register, login as loginService } from '../../services/auth.js';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';


export default function SignupForm() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    async function handleSubmit() {
        // Clear previous error messages
        setUsernameError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // Validate that username and password are not empty
        if (!username) return setUsernameError('Username is required');
        if (!password) return setPasswordError('Password is required');
        if (!confirmPassword) return setConfirmPasswordError('Please confirm your password');
        if (password !== confirmPassword) {
            setPassword('');
            setConfirmPassword('');
            setPasswordError('Passwords do not match')
            return setConfirmPasswordError('Passwords do not match');
        }

        try {
            // Call the register service to create a new user
            const response = await register(username, password);
            console.log('Signup response:', response);

            // If the registration is successful, log in the user
            if (response.message === 'User created successfully') {
                const loginResponse = await loginService(username, password);
                console.log('Login response after signup:', loginResponse);
                
                // If the login is successful, store the token and navigate to the chat page
                if (loginResponse.token) {
                    login(loginResponse.token);
                    navigate('/chat');
                }

            } else if (response.message === 'Username already exists') {
                // If the username already exists, clear the username and password and display an error message
                setUsername('');
                setUsernameError('Username already exists');
            }  else if (response.message === 'Password must be at least 6 characters') {
                // If the password is too short, clear the password and confirm password and display an error message
                setPassword('');
                setConfirmPassword('');
                setPasswordError('Password must be at least 6 characters');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    }


    return (
        <div className="register-card">
            <h1>Create Account</h1>
            <p>Join StarGazerChat today</p>

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
            <div className="form-group">
                <label>Confirm Password</label>
                <input 
                    type="password" 
                    placeholder={confirmPasswordError || "Confirm your password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={confirmPasswordError ? 'input-error' : ''}
                />
            </div>
            <button className="register-btn" onClick={handleSubmit}>
                Create Account
            </button>
            <p className="login-link">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}