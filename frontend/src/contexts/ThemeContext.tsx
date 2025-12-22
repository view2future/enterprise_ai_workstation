import React, { createContext, useContext, useState, useEffect } from 'react';

// 更新主题命名：CYBER (蓝色), STEALTH (深色), HAZARD (高能)
export type Theme = 'cyber' | 'stealth' | 'hazard';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 兼容旧值，如果没有或不匹配则默认 cyber
    const saved = localStorage.getItem('sys-theme');
    if (saved === 'cyber' || saved === 'stealth' || saved === 'hazard') return saved as Theme;
    return 'cyber';
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('sys-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};