import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import SignupPage from './pages/SignupPage/SignupPage.jsx';
import ChatPage from './pages/ChatPage/ChatPage.jsx';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage.jsx';
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
        </Routes>
    );
}