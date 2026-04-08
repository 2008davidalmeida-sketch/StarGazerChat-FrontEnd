import './Hero.css';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/image3.png';

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Let's Connect with Your Friends in Real Time</h1>
                <p>StarGazerChat is a real-time chat app that lets you connect with friends and family instantly.</p>
                <button className="hero-btn" onClick={() => navigate('/signup')}>Start Chatting Now</button>
            </div>
            <div className="hero-image">
                {heroImage && <img src={heroImage} alt="Chatting Illustration" className='image1' />}
            </div>
        </section>
    );
}