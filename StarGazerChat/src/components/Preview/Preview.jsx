
import './Preview.css';

export default function Preview() {
    return (
        <section className="preview">
            <h2>See it in Action</h2>
            <p>A seamless chat experience designed for real conversations.</p>
            <div className="preview-container">
                <div className="preview-main">
                    {/* main screenshot goes here */}
                </div>
                <div className="preview-side">
                    <div className="preview-small">
                        {/* screenshot 2 goes here */}
                    </div>
                    <div className="preview-small">
                        {/* screenshot 3 goes here */}
                    </div>
                </div>
            </div>
        </section>
    );
}