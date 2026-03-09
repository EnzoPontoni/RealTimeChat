import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

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
    navigate('/');
  };

  if (loadingRoom) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Sala não encontrada</p>
          <button
            onClick={handleBack}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{room.name}</h1>
            {room.description && (
              <p className="text-sm text-gray-400">{room.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
            <span className="text-sm text-gray-400">
              {connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <div className="lg:hidden text-sm text-gray-400">
            {users.length} online
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1">
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center flex-1">
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
              />
            </>
          )}
        </div>
        <UserList users={users} currentUserId={user?.id} />
      </div>
    </div>
  );
};

export default ChatRoom;
