import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket deve ser usado dentro de SocketProvider');
  }
  return context;
};

const PROD_SOCKET_URL = 'https://pontonischat-production.up.railway.app';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
  || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : PROD_SOCKET_URL);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    // Só conectar se estiver autenticado
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Criar conexão Socket.io
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Eventos de conexão
    newSocket.on('connect', () => {
      console.log('✅ Socket conectado:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão Socket:', error.message);
      setConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Erro do Socket:', error);
    });

    setSocket(newSocket);

    // Cleanup ao desmontar
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  const value = {
    socket,
    connected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
