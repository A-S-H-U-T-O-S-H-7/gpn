"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useThemeStore from "@/lib/stores/useThemeStore";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Video,
  Tv,
  Star,
  TrendingUp,
  FolderTree,
  Sparkles,
  Users,
  Mail,
  Settings,
  Shield,
  Eye,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";

const navigationItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Videos", href: "/admin/videos", icon: Video },
  { name: "Live TV", href: "/admin/live-tv", icon: Tv },
  { name: "Editor's Pick", href: "/admin/editors-pick", icon: Star },
  { name: "Trending", href: "/admin/trending", icon: TrendingUp },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Horoscope", href: "/admin/horoscope", icon: Sparkles },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { name: "Activity Logs", href: "/admin/activity-logs", icon: Eye },
  { name: "Admin Management", href: "/admin/admin-management", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isDarkMode } = useThemeStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl shadow-lg transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-red border border-gray-700"
            : "bg-white hover:bg-red-50 text-red border border-gray-200"
        }`}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 shadow-xl z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isDarkMode
            ? "bg-gray-800 border-r border-gray-700"
            : "bg-white border-r border-gray-200"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className={`flex items-center justify-center px-4 py-5 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <Link href="/admin/dashboard" onClick={() => setIsMobileOpen(false)}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red rounded-lg flex items-center justify-center shadow-md">
              <Image
                src="/logo.webp"
                alt="GPN - Great Post News"
                width={50}
                height={50}
                className="h-10 w-10"
                priority
              /> 
               </div>
              <div>
                <h1 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  GPN Admin
                </h1>
                <p className={`text-[10px] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Great Post News
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-red text-white shadow-md"
                      : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
