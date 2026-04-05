import './SignupForm.css';

export default function SignupForm() {
    return (
        <div className="register-card">
            <h1>Create Account</h1>
            <p>Join StarGazerChat today</p>

            <div className="form-group">
                <label>Username</label>
                <input type="text" placeholder="Enter your username" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" />
            </div>
            <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm your password" />
            </div>
            <button className="register-btn">Create Account</button>
            <p className="login-link">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}