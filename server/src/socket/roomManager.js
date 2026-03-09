
class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.users = new Map();
    this.typing = new Map();
  }
  joinRoom(socketId, roomId, userId, username) {
    this.leaveCurrentRoom(socketId);
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
      this.typing.set(roomId, new Set());
    }
    const roomUsers = this.rooms.get(roomId);
    roomUsers.add({ socketId, username, userId });
    this.users.set(socketId, { userId, username, currentRoomId: roomId });

    return this.getRoomUsers(roomId);
  }
  leaveCurrentRoom(socketId) {
    const user = this.users.get(socketId);
    
    if (!user || !user.currentRoomId) {
      return null;
    }

    const roomId = user.currentRoomId;
    const roomUsers = this.rooms.get(roomId);

    if (roomUsers) {
      for (const u of roomUsers) {
        if (u.socketId === socketId) {
          roomUsers.delete(u);
          break;
        }
      }
      const typingUsers = this.typing.get(roomId);
      if (typingUsers) {
        typingUsers.delete(user.username);
      }
      if (roomUsers.size === 0) {
        this.rooms.delete(roomId);
        this.typing.delete(roomId);
      }
    }

    const username = user.username;
    this.users.delete(socketId);

    return { roomId, username };
  }
  getRoomUsers(roomId) {
    const roomUsers = this.rooms.get(roomId);
    if (!roomUsers) {
      return [];
    }
    return Array.from(roomUsers).map(u => ({ 
      username: u.username, 
      userId: u.userId 
    }));
  }
  getUserInfo(socketId) {
    return this.users.get(socketId);
  }
  startTyping(socketId, roomId, username) {
    if (!this.typing.has(roomId)) {
      this.typing.set(roomId, new Set());
    }
    this.typing.get(roomId).add(username);
  }
  stopTyping(socketId, roomId, username) {
    const typingUsers = this.typing.get(roomId);
    if (typingUsers) {
      typingUsers.delete(username);
    }
  }
  getTypingUsers(roomId) {
    const typingUsers = this.typing.get(roomId);
    return typingUsers ? Array.from(typingUsers) : [];
  }
  getRoomInfo(roomId) {
    return {
      users: this.getRoomUsers(roomId),
      typing: this.getTypingUsers(roomId),
      count: this.rooms.get(roomId)?.size || 0
    };
  }
}

module.exports = new RoomManager();
