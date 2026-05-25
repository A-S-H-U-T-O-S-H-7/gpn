"use client";

import { useEffect } from "react";
import ThemeProvider from "@/components/providers/ThemeProvider";
import useAuthStore from "@/lib/stores/useAuthStore";

export default function ClientLayout({ children }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}