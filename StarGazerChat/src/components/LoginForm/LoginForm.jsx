import './LoginForm.css';

export default function LoginForm() {
    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome Back!</h1>
                <p>Login to continue chatting</p>

                <div className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" placeholder="Enter your username" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" />
                    </div>
                    <button className="login-btn">Login</button>
                    <p className="register-link">
                        Don't have an account? <a href="/signup">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
}