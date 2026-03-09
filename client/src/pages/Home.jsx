import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import RoomList from '../components/Rooms/RoomList';
import CreateRoomModal from '../components/Rooms/CreateRoomModal';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleRoomCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a2e', padding: '16px' }}>
      <div className="max-w-7xl mx-auto">
        <header className="rounded-[var(--border-radius-lg)] px-6 py-5 mb-6 flex items-center justify-between shadow-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Real-Time Chat</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Bem-vindo, <span className="text-[var(--accent-cyan)] font-semibold">{user?.username}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-white font-semibold py-2.5 px-5 rounded-xl transition-all"
          >
            Sair
          </button>
        </header>
        <main className="rounded-[var(--border-radius-lg)] p-6 shadow-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <RoomList
            key={refreshKey}
            onCreateRoom={() => setShowCreateModal(true)}
          />
        </main>
      </div>
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
};

export default Home;
