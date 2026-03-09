import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
export const useChat = (roomId) => {
  const { socket, connected } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const typingTimeoutRef = useRef(null);
  useEffect(() => {
    if (!socket || !connected || !roomId) {
      return;
    }

    console.log('🚪 Entrando na sala:', roomId);
    socket.emit('join_room', { roomId });
    const handleMessageHistory = (historyMessages) => {
      console.log('📜 Histórico recebido:', historyMessages.length, 'mensagens');
      setMessages(historyMessages);
      setLoading(false);
    };
    const handleReceiveMessage = (message) => {
      console.log('💬 Nova mensagem:', message);
      setMessages((prev) => [...prev, message]);
    };
    const handleRoomUsers = (roomUsers) => {
      console.log('👥 Usuários na sala:', roomUsers);
      setUsers(roomUsers);
    };
    const handleUserJoined = ({ username }) => {
      console.log('👋 Usuário entrou:', username);
    };
    const handleUserLeft = ({ username }) => {
      console.log('🚪 Usuário saiu:', username);
    };
    const handleUserTyping = ({ username }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    };
    const handleUserStopTyping = ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };
    const handleError = ({ message }) => {
      console.error('❌ Erro do socket:', message);
      setError(message);
    };
    socket.on('message_history', handleMessageHistory);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('room_users', handleRoomUsers);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);
    socket.on('error', handleError);
    return () => {
      console.log('🚪 Saindo da sala:', roomId);
      socket.emit('leave_room', { roomId });
      
      socket.off('message_history', handleMessageHistory);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('room_users', handleRoomUsers);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
      socket.off('error', handleError);

      setMessages([]);
      setUsers([]);
      setTypingUsers([]);
      setLoading(true);
      setError(null);
    };
  }, [socket, connected, roomId]);
  const sendMessage = useCallback(
    (content) => {
      if (!socket || !connected || !roomId || !content.trim()) {
        return;
      }

      socket.emit('send_message', {
        roomId,
        content: content.trim(),
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      socket.emit('typing_stop', { roomId });
    },
    [socket, connected, roomId]
  );
  const startTyping = useCallback(() => {
    if (!socket || !connected || !roomId) {
      return;
    }

    socket.emit('typing_start', { roomId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { roomId });
    }, 3000);
  }, [socket, connected, roomId]);
  const stopTyping = useCallback(() => {
    if (!socket || !connected || !roomId) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socket.emit('typing_stop', { roomId });
  }, [socket, connected, roomId]);

  return {
    messages,
    users,
    typingUsers,
    loading,
    error,
    connected,
    sendMessage,
    startTyping,
    stopTyping,
  };
};
