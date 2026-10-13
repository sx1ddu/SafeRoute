import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // ✅ FIX: Render ka live URL yahan direct dalo fallback ke liye
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://school-bus-tracking.onrender.com';
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'], // Dono allow karo takki connection fail na ho
      withCredentials: true
    });

    setSocket(newSocket);

    // Jab app band ho toh connection tod do
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);