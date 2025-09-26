import { useState, useEffect } from 'react'
import './homepage.css'

// Icon Components
const MenuIcon = () => (
    <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);

const PlayIcon = () => (
    <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
    </svg>
);

// Navigation Component
const Navigation = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <nav className="nav">
            <div className="nav-container">
                <div className="nav-left">
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <MenuIcon />
                    </button>
                    <h1 className="logo">EchoBot</h1>
                </div>
                <div className="nav-links">
                    <a href="#home" className="nav-link">Home</a>
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#documentation" className="nav-link">Documentation</a>
                    <a href="#tutorials" className="nav-link">Tutorials</a>
                    <a href="#about" className="nav-link">About Us</a>
                </div>
                <button className="mobile-menu-btn">
                    <MenuIcon />
                </button>
            </div>
        </nav>
    );
};

// Sidebar Component
const Sidebar = ({ isOpen }) => {
    const sidebarLinks = [
        { href: "#safety", text: "Safety" },
        { href: "#research", text: "Research" },
        { href: "#company", text: "Company" },
        { href: "#products", text: "Products" },
        { href: "#developers", text: "Developers" },
        { href: "#support", text: "Support" },
        { href: "#blog", text: "Blog" }
    ];

    return (
        <div className={`sidebar ${!isOpen ? 'hidden' : ''}`}>
            <nav className="sidebar-nav">
                {sidebarLinks.map((link, index) => (
                    <a key={index} href={link.href} className="sidebar-link">
                        <span className="sidebar-icon">🔗</span>
                        {link.text}
                    </a>
                ))}
            </nav>
        </div>
    );
};

// Chatbot Component
const Chatbot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "👋 Hello! I'm EchoBot. I can communicate in any language. Try asking me something in English, Spanish, French, Hindi, or any other language!",
            isUser: false
        }
    ]);
    const [inputValue, setInputValue] = useState('');

    const responses = [
        "That's a great question! I can help you with that in any language you prefer.",
        "¡Excelente! Puedo responder en español también. ¿En qué más puedo ayudarte?",
        "C'est fantastique! Je peux communiquer en français. Comment puis-je vous aider?",
        "यह बहुत अच्छा है! मैं हिंदी में भी बात कर सकता हूं। आप क्या जानना चाहते हैं?",
        "素晴らしい！日本語でもお話しできます。他に何かお手伝いできることはありますか？",
        "That's interesting! I understand context across languages. Feel free to switch between languages anytime.",
        "Wonderful! I can detect the language you're using and respond appropriately. Try me in any language!"
    ];

    const sendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            isUser: true
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                text: responses[Math.floor(Math.random() * responses.length)],
                isUser: false
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chatbot-overlay" onClick={onClose}>
            <div className="chatbot-container" onClick={(e) => e.stopPropagation()}>
                <div className="chatbot-header">
                    <h3 className="chatbot-title">Echobot Chat</h3>
                    <button className="close-btn" onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="chat-messages">
                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.isUser ? 'user' : ''}`}>
                            <div className={`message-bubble ${message.isUser ? 'user' : 'bot'}`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message in any language..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="send-btn" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hero Section Component
const HeroSection = ({ onTryNow, onViewDocs }) => {
    return (
        <section id="home" className="hero">
            <div className="container">
                <div className="hero-content">
                    <p className="hero-subtitle">
                        Breaking language barriers with intelligent AI that understands and responds in any language seamlessly.
                    </p>
                    <h1 className="hero-title">
                        The Future of
                        <br />
                        <span className="hero-highlight">Multilingual AI</span>
                    </h1>
                    <p className="hero-description">
                        Experience the power of language-agnostic conversation. Our AI chatbot understands context, culture, and nuance of languages.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary" onClick={onTryNow}>
                            Try Now
                        </button>
                        <button className="btn btn-secondary" onClick={onViewDocs}>
                            View Documentation
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Features Section Component
const FeaturesSection = () => {
    const features = [
        {
            icon: "🌍",
            iconClass: "blue",
            title: "Various Languages",
            description: "Seamlessly communicate in over various languages with perfect context understanding and cultural awareness."
        },
        {
            icon: "⚡",
            iconClass: "green",
            title: "Lightning Fast",
            description: "Get instant responses with our optimized AI engine that processes multilingual queries in seconds."
        },
        {
            icon: "🔒",
            iconClass: "purple",
            title: "Privacy First",
            description: "Your conversations are encrypted and secure. We prioritize your privacy with enterprise-grade security."
        }
    ];

    return (
        <section id="features" className="section section-beige">
            <div className="container">
                <h2 className="section-title">Powerful Features</h2>
                <p className="section-subtitle">Advanced AI capabilities that understand context across languages</p>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className={`feature-icon ${feature.iconClass}`}>
                                <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Documentation Section Component
const DocumentationSection = () => {
    const docs = [
        {
            title: "Quick Start Guide",
            description: "Get up and running with Echobot in under 5 minutes.",
            link: "Read Guide →"
        },
        {
            title: "API Reference",
            description: "Complete API documentation with examples and code snippets.",
            link: "View API →"
        },
        {
            title: "Integration Examples",
            description: "Real-world examples for web, mobile, and desktop applications.",
            link: "See Examples →"
        }
    ];

    return (
        <section id="documentation" className="section section-stone">
            <div className="container">
                <h2 className="section-title">Documentation</h2>
                <p className="section-subtitle">Everything you need to integrate and use Echobot</p>
                <div className="docs-grid">
                    {docs.map((doc, index) => (
                        <div key={index} className="doc-card">
                            <h3 className="doc-title">{doc.title}</h3>
                            <p className="doc-description">{doc.description}</p>
                            <a href="#" className="doc-link">{doc.link}</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Tutorials Section Component
const TutorialsSection = () => {
    return (
        <section id="tutorials" className="section section-beige">
            <div className="container">
                <h2 className="section-title">Video Tutorials</h2>
                <p className="section-subtitle">Learn how to make the most of Echobot</p>
                <div className="tutorial-container">
                    <div className="tutorial-video">
                        <div>
                            <div className="play-icon">
                                <PlayIcon />
                            </div>
                            <p style={{ color: '#4b5563', margin: '8px 0' }}>Getting Started with Echobot</p>
                            <p style={{ color: '#6b7280', fontSize: '14px' }}>Duration: 5:30</p>
                        </div>
                    </div>
                    <button className="btn btn-primary">
                        Watch Tutorial
                    </button>
                </div>
            </div>
        </section>
    );
};

// About Section Component
const AboutSection = () => {
    return (
        <section id="about" className="section section-stone">
            <div className="container">
                <h2 className="section-title">About Our Project</h2>
                <p className="section-subtitle" style={{ maxWidth: '768px', margin: '0 auto 64px' }}>
                    Echobot represents the future of multilingual AI communication.
                    Our team has created an innovative solution that breaks down language barriers and enables seamless
                    global communication through advanced natural language processing.
                </p>
                {/* <div className="about-content">
                    <div className="about-grid">
                        <div className="about-text">
                            <h3>Smart India Hackathon 2024</h3>
                            <p>
                                Our language-agnostic chatbot solution addresses the critical need for seamless multilingual
                                communication in our diverse world. Built with cutting-edge AI technology, it understands
                                context, culture, and nuance across languages.
                            </p>
                            <div className="tags">
                                <span className="tag blue">AI/ML</span>
                                <span className="tag green">NLP</span>
                                <span className="tag purple">Multilingual</span>
                                <span className="tag orange">Innovation</span>
                            </div>
                        </div> 
                         <div className="about-highlight">
                            <div className="trophy">🏆</div>
                            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '8px 0' }}>SIH 2024 Project</h4>
                            <p style={{ color: '#4b5563', margin: 0 }}>Revolutionizing global communication through AI</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h3>Echobot</h3>
                        <p>Breaking language barriers with intelligent AI that understands and responds in any language seamlessly.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Product</h4>
                        <ul className="footer-links">
                            <li><a href="#">Features</a></li>

                            <li><a href="#">API</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Resources</h4>
                        <ul className="footer-links">
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">Tutorials</a></li>
                            <li><a href="#">Support</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><a href="#">About</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Privacy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Echobot. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// Main App Component
export default function Homepage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatbotOpen, setChatbotOpen] = useState(false);

    const handleTryNow = () => {
        setChatbotOpen(true);
    };

    const handleViewDocs = () => {
        const docsSection = document.getElementById('documentation');
        if (docsSection) {
            docsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCloseChatbot = () => {
        setChatbotOpen(false);
    };

    // Handle smooth scrolling for navigation links
    useEffect(() => {
        const handleNavClick = (e) => {
            if (e.target.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        document.addEventListener('click', handleNavClick);
        return () => document.removeEventListener('click', handleNavClick);
    }, []);

    return (
        <div className="gradient-bg">
            <Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar isOpen={sidebarOpen} />

            <main className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
                <HeroSection onTryNow={handleTryNow} onViewDocs={handleViewDocs} />
                <FeaturesSection />
                <DocumentationSection />
                <TutorialsSection />
                <AboutSection />
                <Footer />
            </main>

            <Chatbot isOpen={chatbotOpen} onClose={handleCloseChatbot} />
        </div>
    );
};