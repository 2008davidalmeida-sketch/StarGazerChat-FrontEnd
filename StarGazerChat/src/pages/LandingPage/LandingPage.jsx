import './LandingPage.css';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Features from '../../components/Features/Features.jsx';
import Footer from '../../components/Footer/Footer.jsx';

export default function LandingPage() {
    return (
        <div className='landing-container'>
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </div>
    );
}