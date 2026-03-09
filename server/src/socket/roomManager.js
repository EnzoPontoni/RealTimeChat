// Gerenciador de estado das salas em memória
// Rastreia usuários online em cada sala

class RoomManager {
  constructor() {
    // Estrutura: { roomId: Set<{ socketId, username, userId }> }
    this.rooms = new Map();
    // Estrutura: { socketId: { userId, username, currentRoomId } }
    this.users = new Map();
    // Estrutura: { roomId: Set<username> } - rastreando quem está digitando
    this.typing = new Map();
  }

  // Adicionar usuário a uma sala
  joinRoom(socketId, roomId, userId, username) {
    // Remover usuário da sala anterior, se houver
    this.leaveCurrentRoom(socketId);

    // Inicializar sala se não existir
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
      this.typing.set(roomId, new Set());
    }

    // Adicionar usuário à sala
    const roomUsers = this.rooms.get(roomId);
    roomUsers.add({ socketId, username, userId });

    // Atualizar mapeamento de usuários
    this.users.set(socketId, { userId, username, currentRoomId: roomId });

    return this.getRoomUsers(roomId);
  }

  // Remover usuário da sala atual
  leaveCurrentRoom(socketId) {
    const user = this.users.get(socketId);
    
    if (!user || !user.currentRoomId) {
      return null;
    }

    const roomId = user.currentRoomId;
    const roomUsers = this.rooms.get(roomId);

    if (roomUsers) {
      // Remover usuário da sala
      for (const u of roomUsers) {
        if (u.socketId === socketId) {
          roomUsers.delete(u);
          break;
        }
      }

      // Remover do typing se estava digitando
      const typingUsers = this.typing.get(roomId);
      if (typingUsers) {
        typingUsers.delete(user.username);
      }

      // Limpar sala se vazia
      if (roomUsers.size === 0) {
        this.rooms.delete(roomId);
        this.typing.delete(roomId);
      }
    }

    const username = user.username;
    this.users.delete(socketId);

    return { roomId, username };
  }

  // Obter lista de usuários em uma sala
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

  // Obter informações do usuário por socketId
  getUserInfo(socketId) {
    return this.users.get(socketId);
  }

  // Marcar usuário como digitando
  startTyping(socketId, roomId, username) {
    if (!this.typing.has(roomId)) {
      this.typing.set(roomId, new Set());
    }
    this.typing.get(roomId).add(username);
  }

  // Marcar usuário como parou de digitar
  stopTyping(socketId, roomId, username) {
    const typingUsers = this.typing.get(roomId);
    if (typingUsers) {
      typingUsers.delete(username);
    }
  }

  // Obter usuários digitando em uma sala
  getTypingUsers(roomId) {
    const typingUsers = this.typing.get(roomId);
    return typingUsers ? Array.from(typingUsers) : [];
  }

  // Obter todas as informações de uma sala
  getRoomInfo(roomId) {
    return {
      users: this.getRoomUsers(roomId),
      typing: this.getTypingUsers(roomId),
      count: this.rooms.get(roomId)?.size || 0
    };
  }
}

module.exports = new RoomManager();
