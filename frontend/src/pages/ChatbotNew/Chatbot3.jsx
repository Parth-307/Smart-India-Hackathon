import { useState, useRef, useEffect } from "react";
import './chatbot3.css'

export default function ChatBot3() {
    const [theme, setTheme] = useState('light');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Hello! I\'m your student assistant. How can I help you with your studies today?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        { id: 1, title: 'Math Help', preview: 'Asked about calculus derivatives...', messages: [] },
        { id: 2, title: 'Science Project', preview: 'Discussion about photosynthesis...', messages: [] },
        { id: 3, title: 'Essay Writing', preview: 'Help with thesis statement...', messages: [] }
    ]);
    const [suggestions] = useState([
        "Help me with math homework",
        "Explain photosynthesis",
        "How to write a thesis statement",
        "Study tips for exams",
        "Grammar rules explained",
        "Science project ideas",
        "History timeline help",
        "Literature analysis guide",
        "Chemistry formulas",
        "Physics concepts"
    ]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        document.body.className = theme + '-theme';
    }, [theme]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const sendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = '44px';
            inputRef.current.style.overflowY = 'hidden';
        }

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                content: getBotResponse(inputValue),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const getBotResponse = (userInput) => {
        const responses = [
            "That's a great question! Let me help you understand this concept better.",
            "I can definitely assist you with that. Here's what you need to know...",
            "Based on your question, I recommend focusing on these key points:",
            "This is a common topic students ask about. Let me break it down for you:",
            "Great question! This relates to several important concepts we should explore."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);

        // Auto-resize textarea
        const textarea = e.target;
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 120; // matches CSS max-height
        const minHeight = 44; // matches CSS min-height

        if (scrollHeight > maxHeight) {
            textarea.style.height = maxHeight + 'px';
            textarea.style.overflowY = 'auto';
        } else if (scrollHeight < minHeight) {
            textarea.style.height = minHeight + 'px';
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = scrollHeight + 'px';
            textarea.style.overflowY = 'hidden';
        }
    };

    const reportMessage = (messageId, reason) => {
        alert(`Message reported as: ${reason}`);
        // In a real app, this would send the report to your backend
    };

    const toggleVoice = () => {
        setIsVoiceActive(!isVoiceActive);
        if (!isVoiceActive) {
            // Start voice recognition
            alert('Voice chat activated! (This is a demo - voice features would be implemented with Web Speech API)');
        } else {
            // Stop voice recognition
            alert('Voice chat deactivated!');
        }
    };

    const toggleSignLanguage = () => {
        alert('Sign language mode activated! (This would integrate with sign language recognition APIs)');
    };

    const loadChatHistory = (historyItem) => {
        setMessages([
            {
                id: 1,
                type: 'bot',
                content: `Loaded previous conversation: ${historyItem.title}`,
                timestamp: new Date()
            }
        ]);
        setIsHistoryOpen(false);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="app">
            <div className="chat-wrapper">
                <header className="header">
                    <h1>Student Assistant</h1>
                    <div className="header-controls">
                        <button
                            className="icon-button"
                            onClick={() => setIsHistoryOpen(true)}
                            title="Chat History"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9,18 15,12 9,6" />
                                <path d="M20 4v7a4 4 0 0 1-4 4H5" />
                                <polyline points="1,11 5,15 9,11" />
                            </svg>
                        </button>
                        <button
                            className="icon-button"
                            onClick={toggleTheme}
                            title="Toggle Theme"
                        >
                            {theme === 'light' ?
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                                :
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            }
                        </button>
                    </div>
                </header>

                <div className="chat-container">
                    <div className="messages-area">
                        {messages.map((message) => (
                            <div key={message.id} className={`message ${message.type}`}>
                                <div className="message-avatar">
                                    {message.type === 'user' ?
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        :
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <circle cx="12" cy="5" r="2" />
                                            <path d="M12 7v4" />
                                            <line x1="8" y1="16" x2="8" y2="16" />
                                            <line x1="16" y1="16" x2="16" y2="16" />
                                        </svg>
                                    }
                                </div>
                                <div>
                                    <div className="message-content">
                                        {message.content}
                                    </div>
                                    {message.type === 'bot' && (
                                        <div className="message-actions">
                                            <button
                                                className="action-button"
                                                onClick={() => reportMessage(message.id, 'wrong')}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="15" y1="9" x2="9" y2="15" />
                                                    <line x1="9" y1="9" x2="15" y2="15" />
                                                </svg>
                                                Wrong
                                            </button>
                                            <button
                                                className="action-button"
                                                onClick={() => reportMessage(message.id, 'insufficient')}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="16" x2="12" y2="12" />
                                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                                </svg>
                                                Insufficient
                                            </button>
                                            <button
                                                className="action-button"
                                                onClick={() => reportMessage(message.id, 'helpful')}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                                                    <path d="M3 11h18l-1 7H4l-1-7z" />
                                                </svg>
                                                Helpful
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="input-area">
                        <div className="suggestions-container">
                            <div className="suggestions-scroll">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        className="suggestion-chip"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="input-container">
                            <div className="voice-controls">
                                <button
                                    className={`voice-button ${isVoiceActive ? 'active' : ''}`}
                                    onClick={toggleVoice}
                                    title="Voice Chat"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" y1="19" x2="12" y2="23" />
                                        <line x1="8" y1="23" x2="16" y2="23" />
                                    </svg>
                                </button>
                                <button
                                    className="voice-button"
                                    onClick={toggleSignLanguage}
                                    title="Sign Language"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                                        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                                    </svg>
                                </button>
                            </div>
                            <div className="input-wrapper">
                                <textarea
                                    ref={inputRef}
                                    className="message-input"
                                    placeholder="Ask me anything about your studies..."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    rows="1"
                                />
                            </div>
                            <button
                                className="send-button"
                                onClick={sendMessage}
                                disabled={!inputValue.trim()}
                                title="Send Message"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22,2 15,22 11,13 2,9" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`overlay ${isHistoryOpen ? 'open' : ''}`} onClick={() => setIsHistoryOpen(false)} />

            <div className={`history-panel ${isHistoryOpen ? 'open' : ''}`}>
                <div className="history-header">
                    <h3>Chat History</h3>
                    <button
                        className="icon-button"
                        onClick={() => setIsHistoryOpen(false)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="history-list">
                    {chatHistory.map((item) => (
                        <div
                            key={item.id}
                            className="history-item"
                            onClick={() => loadChatHistory(item)}
                        >
                            <div className="history-item-title">{item.title}</div>
                            <div className="history-item-preview">{item.preview}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}