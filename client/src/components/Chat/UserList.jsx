const UserList = ({ users, currentUserId }) => {
  return (
    <div className="w-64 border-l border-[var(--bg-card)] p-4 hidden lg:block" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <h3 className="text-lg font-semibold text-white mb-4">
        Online ({users.length})
      </h3>
      <div className="space-y-2">
        {users.map((user) => {
          const isCurrentUser = user.userId === currentUserId;
          
          return (
            <div
              key={user.userId}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-secondary)]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.username}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-[var(--text-secondary)]">(você)</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <p className="text-sm text-[var(--text-secondary)] text-center py-4">
          Nenhum usuário online
        </p>
      )}
    </div>
  );
};

export default UserList;
