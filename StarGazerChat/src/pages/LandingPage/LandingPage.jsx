import './LandingPage.css';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Features from '../../components/Features/Features.jsx';
import Preview from '../../components/Preview/Preview.jsx';
import Footer from '../../components/Footer/Footer.jsx';

export default function LandingPage() {
    return (
        <div className='landing-container'>
            <Navbar />
            <Hero />
            <Features />
            <Preview />
            <Footer />
        </div>
    );
}