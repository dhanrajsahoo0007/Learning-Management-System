import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  isRainbow: boolean;
  toggleRainbow: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isRainbow, setIsRainbow] = useState(() => {
    return localStorage.getItem('rainbow') === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isRainbow) {
      root.classList.add('rainbow-mode');
      root.classList.remove('dark');
    } else if (isDark) {
      root.classList.add('dark');
      root.classList.remove('rainbow-mode');
    } else {
      root.classList.remove('dark', 'rainbow-mode');
    }
  }, [isDark, isRainbow]);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('rainbow', isRainbow.toString());
  }, [isRainbow]);

  // Konami code detection
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          toggleRainbow();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleTheme = () => {
    if (isRainbow) {
      setIsRainbow(false);
    }
    setIsDark(!isDark);
  };

  const toggleRainbow = () => {
    setIsRainbow(!isRainbow);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isRainbow, toggleRainbow }}>
      {children}
    </ThemeContext.Provider>
  );
};
