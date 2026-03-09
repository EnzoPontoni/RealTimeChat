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
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
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

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date}>
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-400">
              {date}
            </div>
          </div>
          {msgs.map((message) => {
            const isOwnMessage = message.user.id === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    isOwnMessage
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  } rounded-lg px-4 py-2 shadow-lg`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-semibold text-primary-300 mb-1">
                      {message.user.username}
                    </div>
                  )}
                  <div className="break-words">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-primary-200' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {typingUsers.length > 0 && (
        <div className="flex justify-start mb-3 animate-fadeIn">
          <div className="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 text-sm">
            <span className="font-semibold">{typingUsers.join(', ')}</span>
            {typingUsers.length === 1 ? ' está digitando' : ' estão digitando'}
            <span className="inline-flex ml-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
