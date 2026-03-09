import IconBar from '../components/Layout/IconBar';
import ChatListSidebar from '../components/Layout/ChatListSidebar';

const Home = () => {
  return (
    <div className="flex h-[100dvh]" style={{ backgroundColor: '#1a1a2e', padding: '16px' }}>
      <div className="flex w-full max-w-[1600px] mx-auto rounded-[var(--border-radius-lg)] overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="hidden md:flex">
          <IconBar />
        </div>
        <div className="w-full md:w-[var(--sidebar-width)] min-h-0 flex-shrink-0">
          <ChatListSidebar />
        </div>

        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center px-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-[var(--accent-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">Select a conversation</h1>
          <p className="text-[var(--text-secondary)] text-sm max-w-md">
            Escolha uma sala na coluna da esquerda para abrir o chat com o novo layout completo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
