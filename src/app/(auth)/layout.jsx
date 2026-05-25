"use client";

import { Toaster } from "react-hot-toast";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      {children}
    </div>
  );
}