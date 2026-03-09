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
      console.error('Erro ao carregar salas:', err);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
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
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          + Nova Sala
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Nenhuma sala criada ainda</p>
          <button
            onClick={onCreateRoom}
            className="text-primary-500 hover:text-primary-400 underline"
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
              className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg animate-fadeIn"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {room.name}
              </h3>
              {room.description && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {room.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {room._count?.messages || 0} mensagens
                </span>
                <span className="text-primary-500 font-medium">
                  Entrar →
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
