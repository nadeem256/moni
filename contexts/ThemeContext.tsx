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
    background: '#0F0F23',
    surface: '#1A1A2E',
    primary: '#34D399',
    text: '#E8E6FF',
    textSecondary: '#B8B5D1',
    border: '#16213E',
    card: '#1A1A2E',
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
  const [isDark, setIsDark] = useState(false);
  const [isPremiumLoaded, setIsPremiumLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
    // Small delay to ensure PremiumContext is loaded
    setTimeout(() => setIsPremiumLoaded(true), 100);
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'true');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
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

  // Create a wrapper component to access usePremium
  const ThemeProviderInner: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isPremium } = usePremium();
    const canUseDarkMode = isPremium;
    
    const theme = isDark ? darkTheme : lightTheme;

    return (
      <ThemeContext.Provider value={{ theme, isDark, toggleTheme, canUseDarkMode }}>
        {children}
      </ThemeContext.Provider>
    );
  };

  // If premium context isn't loaded yet, use light theme as default
  if (!isPremiumLoaded) {
    return (
      <ThemeContext.Provider value={{ 
        theme: lightTheme, 
        isDark: false, 
        toggleTheme, 
        canUseDarkMode: false 
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return <ThemeProviderInner>{children}</ThemeProviderInner>;
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