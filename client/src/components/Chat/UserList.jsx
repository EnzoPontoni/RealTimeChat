const UserList = ({ users, currentUserId }) => {
  return (
    <div className="w-64 border-l border-gray-700 bg-gray-800 p-4 hidden lg:block">
      <h3 className="text-lg font-semibold text-white mb-4">
        Online ({users.length})
      </h3>
      <div className="space-y-2">
        {users.map((user) => {
          const isCurrentUser = user.userId === currentUserId;
          
          return (
            <div
              key={user.userId}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.username}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-gray-400">(você)</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          Nenhum usuário online
        </p>
      )}
    </div>
  );
};

export default UserList;
