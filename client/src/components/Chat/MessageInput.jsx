import { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping, disabled }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Focar no input ao montar
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Indicador de digitação
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onTyping();
    }

    // Reset do timeout de digitação
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Se parar de digitar por 2 segundos
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
    
    // Parar indicador de digitação
    if (isTyping) {
      setIsTyping(false);
      onStopTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Focar novamente no input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Enter sem Shift para enviar
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-700 p-4 bg-gray-800">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Conectando...' : 'Digite sua mensagem...'}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
        >
          Enviar
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        Pressione Enter para enviar
      </p>
    </div>
  );
};

export default MessageInput;
