"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import useThemeStore from "@/lib/stores/useThemeStore";
import AdminSidebar from "@/components/admin/layout/Sidebar";
import AdminHeader from "@/components/admin/layout/Header";

export default function AdminLayout({ children }) {
  const { isAuthenticated, loading, verifySession } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    const init = async () => {
      await verifySession();
      setIsReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    
    if (!isLoginRoute && !isAuthenticated && !loading) {
      router.replace("/admin/login");
    }
    if (isLoginRoute && isAuthenticated && !loading) {
      router.replace("/admin/dashboard");
    }
  }, [isReady, isAuthenticated, loading, isLoginRoute, router]);

  if (!isReady || (loading && !isAuthenticated && !isLoginRoute)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoginRoute) {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Toaster position="top-right" />
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminHeader />
        <main className="px-4 pb-8 pt-20 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
