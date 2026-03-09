import { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUserId, typingUsers }) => {
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today, ' + date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 underline break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={`${part}-${index}`}>{part}</span>;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date}>
          <div className="flex items-center justify-center my-6">
            <div className="bg-[var(--bg-card)] px-4 py-1.5 rounded-full text-xs text-[var(--text-secondary)] font-medium">
              {date}
            </div>
          </div>
          {msgs.map((message) => {
            const isOwnMessage = message.user.id === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
              >
                <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%] md:max-w-[65%]`}>
                  {!isOwnMessage && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {message.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex flex-col" style={{ maxWidth: '100%' }}>
                    <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {!isOwnMessage && `${message.user.username} • `}
                        {formatTime(message.createdAt)}
                        {isOwnMessage && ' • You'}
                      </span>
                      {isOwnMessage && (
                        <svg className="w-3 h-3 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      )}
                    </div>
                    
                    <div
                      className={`px-4 py-3 shadow-md ${
                        isOwnMessage
                          ? 'bg-[var(--accent-cyan)] text-gray-900 rounded-[18px] rounded-br-md'
                          : 'bg-[var(--bg-card)] text-white rounded-[18px] rounded-bl-md'
                      }`}
                    >
                      <div className="break-words text-[15px] leading-relaxed whitespace-pre-wrap">
                        {renderMessageContent(message.content)}
                      </div>
                    </div>
                  </div>

                  {isOwnMessage && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {message.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {typingUsers.length > 0 && (
        <div className="flex justify-start mb-3 animate-fadeIn">
          <div className="bg-[var(--bg-card)] text-gray-300 rounded-lg px-4 py-2 text-sm">
            <span className="font-semibold">{typingUsers.join(', ')}</span>
            {typingUsers.length === 1 ? ' está digitando' : ' estão digitando'}
            <span className="inline-flex ml-1">
              <span className="animate-bounce-dot inline-block">.</span>
              <span className="animate-bounce-dot inline-block">.</span>
              <span className="animate-bounce-dot inline-block">.</span>
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
