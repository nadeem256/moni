import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePremium } from './PremiumContext';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    success: string;
    error: string;
    warning: string;
  };
}

const lightTheme: Theme = {
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#3B82F6',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    card: '#FFFFFF',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  },
};

const darkTheme: Theme = {
  colors: {
    background: '#0A0B0F',
    surface: '#161821',
    primary: '#3B82F6',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: '#1F2937',
    card: '#161821',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  canUseDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'true');
      } else {
        // Default to dark mode
        setIsDark(true);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback to dark mode on error
      setIsDark(true);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('isDarkMode', newTheme.toString());
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const canUseDarkMode = true; // Dark mode is now free
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, canUseDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Remove the old provider code
/*
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
*/