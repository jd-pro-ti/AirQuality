'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      document.documentElement.style.background = '#1a202c';
      document.body.style.background = '#1a202c';
      document.body.style.color = '#ffffff';
    } else if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.style.background = '#ffffff';
      document.body.style.background = '#ffffff';
      document.body.style.color = '#000000';
    } else {
      // Usar preferencia del sistema si no hay tema guardado
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
        document.documentElement.style.background = '#1a202c';
        document.body.style.background = '#1a202c';
        document.body.style.color = '#ffffff';
      } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
        document.documentElement.style.background = '#ffffff';
        document.body.style.background = '#ffffff';
        document.body.style.color = '#000000';
      }
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.background = '#1a202c';
      document.body.style.background = '#1a202c';
      document.body.style.color = '#ffffff';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.background = '#ffffff';
      document.body.style.background = '#ffffff';
      document.body.style.color = '#000000';
      localStorage.setItem('theme', 'light');
    }
  };

  const value = {
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};