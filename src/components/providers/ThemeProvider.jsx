"use client";

import { useEffect } from "react";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function ThemeProvider({ children }) {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return children;
}
