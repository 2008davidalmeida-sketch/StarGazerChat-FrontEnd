import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../hooks/useIsMobile.js';
import './SignupPage.css';
import SignupForm from '../../components/SignupForm/SignupForm.jsx';

export default function SignupPage() {
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    useEffect(() => {
        if (isMobile) {
            navigate('/app-coming-soon', { replace: true });
        }
    }, [isMobile, navigate]);

    if (isMobile) return null; // Wait for redirect

    return (
        <div className="register-container">
            <SignupForm />
        </div>
    );
}