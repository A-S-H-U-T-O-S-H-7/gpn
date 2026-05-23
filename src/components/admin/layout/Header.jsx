"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Sun, Moon, ChevronDown, LogOut } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

export default function AdminHeader() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { admin, adminLogout } = useAdminAuthStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    setDropdownOpen(false);
    router.replace("/admin/login");
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-40 lg:ml-64 transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800/95 border-b border-gray-700 backdrop-blur-md"
          : "bg-white/95 border-b border-gray-200 backdrop-blur-md"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-end gap-4">
          {/* Date & Time */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isDarkMode
                ? "bg-gray-700/80 text-gray-300 border border-gray-600"
                : "bg-gray-100/80 text-gray-600 border border-gray-200"
            }`}
          >
            <span className="text-sm font-medium">
              {format(currentTime, "EEEE, MMMM d, yyyy • h:mm a")}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-red border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-red border border-gray-200"
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700/80 hover:bg-gray-600 border border-gray-600"
                  : "bg-gray-100/80 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <div className="w-8 h-8 bg-red rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {admin?.name?.charAt(0) || admin?.email?.charAt(0) || "A"}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {admin?.name || "Admin"}
                </p>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {admin?.role === "super_admin" ? "Super Admin" : "Admin"}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""} ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-50 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className={`px-4 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {admin?.name || "Admin User"}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {admin?.email}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className={`w-full cursor-pointer px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-red"
                        : "text-gray-700 hover:bg-gray-100 hover:text-red"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
