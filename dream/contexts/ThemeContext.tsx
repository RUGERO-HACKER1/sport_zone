import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  currentTheme: 'light' | 'dark';
  toggleTheme: (newTheme: Theme) => void;
  colors: typeof lightColors | typeof darkColors;
}

const lightColors = {
  primary: '#ffd700', // Gold color from our design
  secondary: '#2ec4b6',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2d3748',
  textSecondary: '#718096',
  border: '#e2e8f0',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#f56565',
  info: '#4299e1',
};

const darkColors = {
  primary: '#ffd700', // Gold color from our design
  secondary: '#2ec4b6',
  background: '#1a1a1a', // Dark background from our design
  card: '#2a2a2a', // Dark card from our design
  text: '#ffffff',
  textSecondary: '#a0aec0',
  border: '#4a5568',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#f56565',
  info: '#4299e1',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('auto');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app-theme');
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('app-theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const currentTheme = theme === 'auto' ? (systemTheme || 'dark') : theme;

  return (
    <ThemeContext.Provider value={{
      theme,
      currentTheme,
      toggleTheme,
      colors: currentTheme === 'light' ? lightColors : darkColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};