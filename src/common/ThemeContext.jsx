import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    
    // Reset the transitioning state after the transition has completed
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with the CSS transition-duration
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
    {children}
    </ThemeContext.Provider>
  );
};
