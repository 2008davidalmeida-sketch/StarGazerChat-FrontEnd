import './MobileAppTeaser.css';
import Logo from '../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';

export default function MobileAppTeaser() {
    const navigate = useNavigate();

    return (
        <div className="teaser-page">
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>
            
            <div className="teaser-content">
                <div className="teaser-logo-wrapper">
                    <img src={Logo} alt="StarGazer Chat Logo" className="teaser-logo" />
                    <div className="logo-pulse"></div>
                </div>
                
                <h1 className="teaser-title">Mobile <br/>Coming Soon</h1>
                
                <div className="teaser-glass-card">
                    <p className="teaser-description">
                        We are currently crafting a native StarGazer experience optimized for your pocket.
                        For now, the full universe awaits you on <strong>Desktop</strong>.
                    </p>
                    
                    <button className="teaser-btn-glow" onClick={() => navigate('/')}>
                        <span>Back to Home</span>
                    </button>
                </div>

                <div className="teaser-footer">
                    <p>Coming to iOS & Android</p>
                </div>
            </div>
        </div>
    );
}
