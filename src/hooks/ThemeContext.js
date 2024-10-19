// ThemeContext.js
import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { Box } from "@mui/material";

const window = global?.window || {};
const localStorage = window.localStorage || {};

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    // If savedMode exists, convert it to a boolean, otherwise use false (light mode)
    setIsDarkMode(savedMode === "true"); 
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode((prev) => !prev);
    localStorage.setItem("theme", newMode);
  };

  const primaryColor = isDarkMode ? "white" : "#333";
  const secondaryColor = isDarkMode ? "#b3b3b3" : "#666";

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme, primaryColor, secondaryColor }}
    >
      <Box
        sx={{
          backgroundImage: isDarkMode
            ? 'url("https://img.freepik.com/premium-photo/dark-blue-background_1314622-4327.jpg?size=626&ext=jpg&ga=GA1.1.1465049063.1725378943&semt=ais_hybrid")' // Image for dark mode
            : "none",
          backgroundColor: isDarkMode ? "transparent" : "#f6f6f6", // Color for light mode
          backgroundSize: "cover", // Ensures image covers the background properly
          backgroundPosition: "center",
          minHeight: "100vh", // Ensures it covers the entire screen
          transition: "background 0.3s ease", // Smooth transition when switching
        }}
      >
        {children}
      </Box>
    </ThemeContext.Provider>
  );
};
