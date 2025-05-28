'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [lens, setLens] = useState('jungle');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          lens: lens 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I am currently experiencing technical difficulties. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showChat) {
    return (
      <div className="landing">
        <h1>Welcome to the Abyss</h1>
        <button className="start-btn" onClick={() => setShowChat(true)}>
          Speak to HerzBot
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <select 
        className="lens-toggle"
        value={lens}
        onChange={(e) => setLens(e.target.value)}
      >
        <option value="jungle">Jungle (Chaos, Survival)</option>
        <option value="ice">Ice (Isolation, Cold Reason)</option>
        <option value="urban">Urban Decay (Human Folly)</option>
      </select>

      <div className="messages">
        {messages.length === 0 ? (
          <div className="message">
            Welcome to the abyss of conversation. What profound thoughts shall we explore today?
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role === 'assistant' ? 'assistant-message' : ''}`}
            >
              {message.content}
            </div>
          ))
        )}
        {isLoading && (
          <div className="message">
            Contemplating the depths of your inquiry...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Confess your thoughts..."
          className="user-input"
        />
        <button type="submit" className="submit-btn">
          Submit to the void
        </button>
      </form>
    </div>
  );
}
