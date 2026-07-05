"use client";

import { createTheme } from "@mui/material/styles";

// these properties can be accessed in your components with `theme.palette` and `theme.typography`
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    error: { main: "#f44336" },
  },
  typography: {
    // match your Geist font from layout if you want
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
});

export default theme;
