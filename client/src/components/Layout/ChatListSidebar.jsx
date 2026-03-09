import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { roomAPI } from '../../services/api';

const ChatListSidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomAPI.getAllRooms();
      setRooms(data.rooms);
    } catch (err) {
      console.error('Erro ao carregar salas:', err);
    }
  };

  const handleRoomClick = (room) => {
    navigate(`/chat/${room.id}`);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="flex-1 bg-[var(--bg-primary)] flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--bg-card)]">
        <h2 className="text-xl font-bold text-white">Chats</h2>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-4 mb-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-bold text-base leading-tight">
                Discover More Groups<br />
                <span className="text-sm font-normal opacity-90">Tingkatkan skills & networking</span>
              </h3>
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-8 -mt-8"></div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--accent-purple)] text-white'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'groups'
                ? 'bg-[var(--accent-purple)] text-white'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'people'
                ? 'bg-[var(--accent-purple)] text-white'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            People
          </button>
        </div>

        <div className="mb-3">
          <span className="text-xs text-[var(--text-secondary)]">All Message ({rooms.length})</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {rooms.map((room) => {
          const isActive = room.id === parseInt(roomId);
          const lastMessage = room.description || 'Sem mensagens ainda...';
          
          return (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-xl cursor-pointer transition-all ${
                isActive
                  ? 'bg-[var(--bg-card)]'
                  : 'hover:bg-[var(--bg-card)]'
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {room.name.charAt(0).toUpperCase()}
                </div>
                {Math.random() > 0.5 && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-primary)]"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="text-white font-semibold text-sm truncate">{room.name}</h4>
                  <span className="text-xs text-[var(--text-secondary)] ml-2 whitespace-nowrap">
                    {formatTime(room.createdAt)}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm truncate">
                  {lastMessage}
                </p>
              </div>

              {Math.random() > 0.7 && (
                <div className="w-5 h-5 bg-[var(--badge-orange)] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {Math.floor(Math.random() * 9) + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {rooms.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-[var(--text-secondary)] text-sm mb-2">Nenhuma sala disponível</p>
            <button
              onClick={() => window.location.href = '/'}
              className="text-[var(--accent-purple)] text-sm hover:underline"
            >
              Criar nova sala
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListSidebar;
