import './Features.css';

export default function Features() {
    const features = [
        {
            icon: '⚡',
            title: 'Real Time',
            description: 'Send and receive messages instantly with no delays.'
        },
        {
            icon: '🔒',
            title: 'Secure',
            description: 'Your messages are protected with JWT authentication.'
        },
        {
            icon: '💬',
            title: 'Group Chats',
            description: 'Create rooms and chat with multiple people at once.'
        }
    ];

    return (
        <section className="features">
            <h2>Why StarGazerChat?</h2>
            <div className="features-grid">
                {features.map((feature, i) => (
                    <div className="feature-card" key={i}>
                        <span className="feature-icon">{feature.icon}</span>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}