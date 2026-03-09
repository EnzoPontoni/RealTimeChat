import { useState } from 'react';
import { roomAPI } from '../../services/api';

const CreateRoomModal = ({ onClose, onRoomCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nome da sala é obrigatório');
      return;
    }

    if (name.trim().length < 3) {
      setError('Nome deve ter pelo menos 3 caracteres');
      return;
    }

    try {
      setLoading(true);
      const data = await roomAPI.createRoom(name.trim(), description.trim());
      onRoomCreated(data.room);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
      <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Criar Nova Sala</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-white text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-card)] transition-all"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
              Nome da Sala *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] text-[15px]"
              style={{ backgroundColor: 'var(--bg-card)' }}
              placeholder="Ex: Discussão Geral"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] resize-none text-[15px]"
              style={{ backgroundColor: 'var(--bg-card)' }}
              placeholder="Descreva sobre o que é esta sala..."
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[var(--accent-purple)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg"
            >
              {loading ? 'Criando...' : 'Criar Sala'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
