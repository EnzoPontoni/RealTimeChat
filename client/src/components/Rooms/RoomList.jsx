import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../../services/api';

const RoomList = ({ onCreateRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomAPI.getAllRooms();
      setRooms(data.rooms);
      setError('');
    } catch (err) {
      setError('Erro ao carregar salas');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-purple)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
        {error}
        <button
          onClick={loadRooms}
          className="ml-4 underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Salas disponíveis</h2>
        <button
          onClick={onCreateRoom}
          className="bg-[var(--accent-purple)] hover:opacity-90 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-lg"
        >
          + Nova Sala
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)] mb-4">Nenhuma sala criada ainda</p>
          <button
            onClick={onCreateRoom}
            className="text-[var(--accent-cyan)] hover:underline font-medium"
          >
            Criar a primeira sala
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room.id)}
              className="bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl animate-fadeIn"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {room.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    {room.name}
                  </h3>
                  {room.description && (
                    <p className="text-[var(--text-secondary)] text-sm line-clamp-2">
                      {room.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm pt-3 border-t border-[var(--bg-primary)]">
                <span className="text-[var(--text-secondary)]">
                  {room._count?.messages || 0} mensagens
                </span>
                <span className="text-[var(--accent-cyan)] font-semibold flex items-center gap-1">
                  Entrar
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
