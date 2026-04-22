import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../hooks/useIsMobile.js';
import LoginForm from '../../components/LoginForm/LoginForm.jsx';
import './LoginPage.css';

export default function LoginPage() {
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    useEffect(() => {
        if (isMobile) {
            navigate('/app-coming-soon', { replace: true });
        }
    }, [isMobile, navigate]);

    if (isMobile) return null; // Wait for redirect

    return (
        <div className="login-container">
            <LoginForm />
        </div>
    );
}