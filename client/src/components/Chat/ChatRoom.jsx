import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import IconBar from '../Layout/IconBar';
import ChatListSidebar from '../Layout/ChatListSidebar';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    messages,
    users,
    typingUsers,
    loading,
    error,
    connected,
    sendMessage,
    startTyping,
    stopTyping,
  } = useChat(roomId);

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [mobileView, setMobileView] = useState('chat');
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await roomAPI.getRoomById(roomId);
        setRoom(data.room);
      } catch (err) {
        console.error('Erro ao carregar sala:', err);
      } finally {
        setLoadingRoom(false);
      }
    };

    loadRoom();
  }, [roomId]);

  const handleBack = () => {
    if (window.innerWidth <= 768) {
      setMobileView('list');
    } else {
      navigate('/');
    }
  };

  if (loadingRoom) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-purple)]"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="text-white text-xl mb-4">Sala não encontrada</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[var(--accent-purple)] hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#1a1a2e', padding: '16px' }}>
      <div className="flex w-full max-w-[1600px] mx-auto rounded-[var(--border-radius-lg)] overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
        
        <div className={`flex ${mobileView === 'list' ? 'flex' : 'hidden'} md:flex w-full md:w-[var(--sidebar-width)] flex-shrink-0`}>
          <IconBar />
          <ChatListSidebar />
        </div>

        <div className={`flex flex-col flex-1 ${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex`}>
          <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--bg-card)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="md:hidden text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                {room.name.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white">{room.name}</h1>
                  <span className="bg-[var(--accent-purple)] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    VIP
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {users.length} Members • <span className="text-[var(--accent-cyan)]">{users.length} Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center flex-1" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-purple)]"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center flex-1" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <MessageList
                messages={messages}
                currentUserId={user?.id}
                typingUsers={typingUsers}
              />
              <MessageInput
                onSendMessage={sendMessage}
                onTyping={startTyping}
                onStopTyping={stopTyping}
                disabled={!connected}
                typingUsers={typingUsers}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
