// app/provider.js
'use client'
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/store';

export default function Providers({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#d26c19" },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#fff",
      },
      text: {
        primary: darkMode ? "#fff" : "#000",
        secondary: darkMode ? "#aaa" : "#555",
      },
    },
  });

  return (
     <html lang="en">
      <body>
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Toggle Switch */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            width: 60,
            height: 30,
            borderRadius: 30,
            backgroundColor: darkMode ? "#555" : "#d26c19",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "3px",
            transition: "background-color 0.3s",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#fff",
              transform: darkMode ? "translateX(30px)" : "translateX(0px)",
              transition: "transform 0.3s",
            }}
          ></div>
        </div>

        {children}
      </ThemeProvider>
    </ReduxProvider>
    </body>
    </html>
  );

}
