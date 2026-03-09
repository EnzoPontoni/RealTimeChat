import { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping, disabled, typingUsers = [] }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onTyping();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onStopTyping();
      }
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || disabled) {
      return;
    }

    onSendMessage(message);
    setMessage('');
    if (isTyping) {
      setIsTyping(false);
      onStopTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-6 py-4 border-t border-[var(--bg-card)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-[var(--bg-card)] rounded-full px-5 py-3 min-h-[48px]">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Conectando...' : 'Type a message...'}
            disabled={disabled}
            className="flex-1 bg-transparent text-white placeholder-[var(--text-secondary)] focus:outline-none text-[15px]"
          />
          <button
            type="button"
            className="text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="bg-[var(--accent-purple)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all shadow-lg min-w-[48px] min-h-[48px]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 mt-3 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-[var(--accent-cyan)] font-medium">
            {`${typingUsers[0]} is typing...`}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
