import "./Navbar.css";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav>
            <div className="nav-logo">
                <h1>StarGazerChat</h1>
            </div>
            <div className="nav-links">
                <a href="#">SG Statistics</a>
                <a href="#">About</a>
                <a href="#">Contact</a>
                <a href="#">Help</a>
            </div>
            <div className="nav-actions">
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/signup')}>Get Started</button>
            </div>
        </nav>
    );
}
