import React, { createContext, useContext, useEffect, useState } from 'react';

interface SocketContextType {
  isConnected: boolean;
  onlinePlayers: number;
  liveMatches: any[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [onlinePlayers, setOnlinePlayers] = useState(156);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOnlinePlayers(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        return Math.max(100, prev + change);
      });

      // Simulate live matches
      setLiveMatches([
        {
          id: '1',
          team1: 'Kigali Warriors',
          team2: 'Dream FC',
          score1: Math.floor(Math.random() * 5),
          score2: Math.floor(Math.random() * 5),
          minute: Math.floor(Math.random() * 90),
          status: 'live'
        },
        {
          id: '2', 
          team1: 'Champions United',
          team2: 'Victory FC',
          score1: Math.floor(Math.random() * 3),
          score2: Math.floor(Math.random() * 3),
          minute: Math.floor(Math.random() * 90),
          status: 'live'
        }
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, onlinePlayers, liveMatches }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};