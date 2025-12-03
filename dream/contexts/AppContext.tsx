import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, buildAuthHeaders } from '../lib/api';

export interface User {
  id: string;
  teamName: string;
  captainName: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: 'player' | 'admin';
}

export interface Tournament {
  id: string;
  name: string;
  status: 'Registration Open' | 'Starting Soon' | 'Ongoing' | 'Completed';
  teams: number;
  maxTeams: number;
  fee: string;
  prize: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  userEmail: string;
  messageType?: 'text' | 'system' | 'announcement';
}

export interface AdminStats {
  totals: {
    users: number;
    tournaments: number;
    teams: number;
    matches: number;
  };
  admin: {
    id: string;
    email: string;
    teamName: string;
  };
}

interface AppContextType {
  user: User | null;
  tournaments: Tournament[];
  messages: Message[];
  isAuthenticated: boolean;
  isHydrated: boolean;
  isAdmin: boolean;
  adminStats: AdminStats | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  registerForTournament: (tournamentId: string, paymentProof?: string) => Promise<boolean>;
  sendMessage: (text: string) => Promise<void>;
  refreshTournaments: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  fetchAdminStats: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'sport-zone-auth';

const statusMap: Record<string, Tournament['status']> = {
  registration_open: 'Registration Open',
  upcoming: 'Starting Soon',
  starting_soon: 'Starting Soon',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Completed',
};

const mapTournament = (apiTournament: any): Tournament => {
  const entryFee = apiTournament.entryFee ?? 0;
  const start = apiTournament.startDate ? new Date(apiTournament.startDate) : null;
  const end = apiTournament.endDate ? new Date(apiTournament.endDate) : null;

  return {
    id: apiTournament.id,
    name: apiTournament.name,
    status: statusMap[apiTournament.status] || 'Registration Open',
    teams: apiTournament.currentTeams ?? apiTournament.teamCount ?? 0,
    maxTeams: apiTournament.maxTeams ?? 0,
    fee: entryFee ? `${entryFee} RWF` : 'Free',
    prize: apiTournament.prizePool || 'TBD',
    startDate: start ? start.toISOString().split('T')[0] : '',
    endDate: end ? end.toISOString().split('T')[0] : '',
    description: apiTournament.description || 'Tournament information coming soon.',
  };
};

const mapMessage = (apiMessage: any): Message => ({
  id: apiMessage.id,
  userId: apiMessage.userId || apiMessage.user?.id || 'system',
  userName: apiMessage.user?.teamName || apiMessage.userName || 'Tournament Admin',
  text: apiMessage.content || apiMessage.text || '',
  timestamp: apiMessage.createdAt || apiMessage.timestamp || new Date().toISOString(),
  userEmail: apiMessage.user?.email || apiMessage.userEmail || 'info@sportzone.app',
  messageType: apiMessage.messageType || 'text',
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const refreshTournaments = useCallback(async () => {
    try {
      const response = await apiFetch('/api/tournaments');
      const normalized = Array.isArray(response.data)
        ? response.data.map(mapTournament)
        : [];
      setTournaments(normalized);
    } catch (error) {
      console.log('Failed to fetch tournaments:', error);
    }
  }, []);

  const refreshMessages = useCallback(async () => {
    try {
      const response = await apiFetch('/api/messages?limit=100');
      const normalized = Array.isArray(response.data)
        ? response.data.map(mapMessage)
        : [];
      setMessages(normalized);
    } catch (error) {
      console.log('Failed to fetch messages:', error);
    }
  }, []);

  const fetchAdminStats = useCallback(async () => {
    if (!token || user?.role !== 'admin') return;
    try {
      const response = await apiFetch('/api/admin/overview', {
        headers: buildAuthHeaders(token),
      });
      if (response.success) {
        setAdminStats(response.data);
      }
    } catch (error) {
      console.log('Failed to fetch admin stats:', error);
    }
  }, [token, user]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed.user ?? null);
          setToken(parsed.token ?? null);
        }
      } catch (error) {
        console.log('Failed to hydrate auth state:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const persist = async () => {
      try {
        if (user && token) {
          await AsyncStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ user, token })
          );
        } else {
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.log('Failed to persist auth state:', error);
      }
    };

    persist();
  }, [user, token, isHydrated]);

  useEffect(() => {
    refreshTournaments();
    refreshMessages();
  }, [refreshTournaments, refreshMessages]);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setUser(response.data.user);
      setToken(response.data.token);
      return response.data.user;
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      setUser(response.data.user);
      setToken(response.data.token);
      return true;
    } catch (error) {
      console.log('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAdminStats(null);
  };

  const registerForTournament = async (tournamentId: string, paymentProof?: string): Promise<boolean> => {
    if (!user) return false;

    if (!token) {
      throw new Error('Please login to register for tournaments');
    }

    try {
      await apiFetch(`/api/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: {
          ...buildAuthHeaders(token),
        },
        body: JSON.stringify({ paymentProof }),
      });

      await refreshTournaments();
      return true;
    } catch (error) {
      console.log('Tournament registration error:', error);
      throw error;
    }
  };

  const sendMessage = async (text: string) => {
    if (!token || !user) {
      throw new Error('Please login to send messages');
    }

    if (!text.trim()) {
      return;
    }

    try {
      const response = await apiFetch('/api/messages', {
        method: 'POST',
        headers: {
          ...buildAuthHeaders(token),
        },
        body: JSON.stringify({ content: text }),
      });

      const formatted = mapMessage(response.data);
      setMessages(prev => [...prev, formatted]);
    } catch (error) {
      console.log('sendMessage error:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      tournaments,
      messages,
      isAuthenticated: !!user && !!token,
      isHydrated,
      isAdmin: user?.role === 'admin',
      adminStats,
      login,
      register,
      logout,
      registerForTournament,
      sendMessage,
      refreshTournaments,
      refreshMessages,
      fetchAdminStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};