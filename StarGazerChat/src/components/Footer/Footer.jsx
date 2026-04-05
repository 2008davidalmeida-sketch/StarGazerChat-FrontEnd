import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <h2>StarGazerChat</h2>
                    <p>Connect with your friends in real time.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Product</h4>
                        <a href="#">Features</a>
                        <a href="#">About</a>
                    </div>
                    <div className="footer-column">
                        <h4>Connect</h4>
                        <a href="#">GitHub</a>
                        <a href="#">Contact</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026 StarGazerChat. All rights reserved.</p>
                <p>Built by Marés Gostosões</p>
            </div>
        </footer>
    );
}