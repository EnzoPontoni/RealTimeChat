import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';

/**
 * Hook customizado para gerenciar funcionalidades do chat
 * Lida com mensagens, usuários online, typing indicators e eventos da sala
 */
export const useChat = (roomId) => {
  const { socket, connected } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const typingTimeoutRef = useRef(null);

  // Entrar na sala
  useEffect(() => {
    if (!socket || !connected || !roomId) {
      return;
    }

    console.log('🚪 Entrando na sala:', roomId);
    
    // Emitir evento de entrada na sala
    socket.emit('join_room', { roomId });
    
    // Listener para histórico de mensagens
    const handleMessageHistory = (historyMessages) => {
      console.log('📜 Histórico recebido:', historyMessages.length, 'mensagens');
      setMessages(historyMessages);
      setLoading(false);
    };

    // Listener para nova mensagem
    const handleReceiveMessage = (message) => {
      console.log('💬 Nova mensagem:', message);
      setMessages((prev) => [...prev, message]);
    };

    // Listener para lista de usuários
    const handleRoomUsers = (roomUsers) => {
      console.log('👥 Usuários na sala:', roomUsers);
      setUsers(roomUsers);
    };

    // Listener para usuário que entrou
    const handleUserJoined = ({ username }) => {
      console.log('👋 Usuário entrou:', username);
    };

    // Listener para usuário que saiu
    const handleUserLeft = ({ username }) => {
      console.log('🚪 Usuário saiu:', username);
    };

    // Listener para usuário digitando
    const handleUserTyping = ({ username }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    };

    // Listener para usuário parou de digitar
    const handleUserStopTyping = ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    // Listener para erros
    const handleError = ({ message }) => {
      console.error('❌ Erro do socket:', message);
      setError(message);
    };

    // Registrar listeners
    socket.on('message_history', handleMessageHistory);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('room_users', handleRoomUsers);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);
    socket.on('error', handleError);

    // Cleanup ao sair da sala
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

  // Enviar mensagem
  const sendMessage = useCallback(
    (content) => {
      if (!socket || !connected || !roomId || !content.trim()) {
        return;
      }

      socket.emit('send_message', {
        roomId,
        content: content.trim(),
      });

      // Parar indicador de digitação
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      socket.emit('typing_stop', { roomId });
    },
    [socket, connected, roomId]
  );

  // Indicar que está digitando
  const startTyping = useCallback(() => {
    if (!socket || !connected || !roomId) {
      return;
    }

    socket.emit('typing_start', { roomId });

    // Auto-parar após 3 segundos
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { roomId });
    }, 3000);
  }, [socket, connected, roomId]);

  // Parar de digitar
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
