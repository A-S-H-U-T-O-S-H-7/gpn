"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Eye,
  FileText,
  Mail,
  Newspaper,
  RefreshCw,
  Users,
  Video,
} from "lucide-react";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import useThemeStore from "@/lib/stores/useThemeStore";
import { getDashboardData } from "@/lib/services/dashboardService";

const initialDashboard = {
  stats: {
    totalNews: 0,
    publishedNews: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalVideos: 0,
    publishedVideos: 0,
    totalUsers: 0,
    activeUsers: 0,
    subscribers: 0,
    unreadMessages: 0,
    totalViews: 0,
    breakingNews: 0,
  },
  recentContent: [],
  recentUsers: [],
  recentMessages: [],
  recentActivities: [],
};

const formatNumber = (value) => {
  const number = Number(value) || 0;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
  return number.toLocaleString("en-US");
};

const formatDate = (date) => {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

function StatCard({ title, value, caption, icon: Icon, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">{value}</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{caption}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function Panel({ title, icon: Icon, children, action }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-red" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-gray-200 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
      {label}
    </div>
  );
}

export default function DashboardPage() {
  const { admin } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError("");
    const result = await getDashboardData();
    if (result.success) {
      setDashboard(result);
    } else {
      setDashboard(initialDashboard);
      setError(result.error || "Unable to load dashboard data");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = dashboard.stats;
  const publishingRate = useMemo(() => {
    const total = stats.totalNews + stats.totalBlogs + stats.totalVideos;
    const published = stats.publishedNews + stats.publishedBlogs + stats.publishedVideos;
    return total ? Math.round((published / total) * 100) : 0;
  }, [stats]);

  const statCards = [
    {
      title: "News",
      value: formatNumber(stats.totalNews),
      caption: `${formatNumber(stats.publishedNews)} published, ${formatNumber(stats.breakingNews)} breaking`,
      icon: Newspaper,
      accent: "bg-red",
    },
    {
      title: "Blogs",
      value: formatNumber(stats.totalBlogs),
      caption: `${formatNumber(stats.publishedBlogs)} published articles`,
      icon: FileText,
      accent: "bg-amber-500",
    },
    {
      title: "Videos",
      value: formatNumber(stats.totalVideos),
      caption: `${formatNumber(stats.publishedVideos)} published videos`,
      icon: Video,
      accent: "bg-sky-600",
    },
    {
      title: "Users",
      value: formatNumber(stats.totalUsers),
      caption: `${formatNumber(stats.activeUsers)} active accounts`,
      icon: Users,
      accent: "bg-emerald-600",
    },
    {
      title: "Views",
      value: formatNumber(stats.totalViews),
      caption: "Across news, blogs, and videos",
      icon: Eye,
      accent: "bg-violet-600",
    },
    {
      title: "Subscribers",
      value: formatNumber(stats.subscribers),
      caption: `${formatNumber(stats.unreadMessages)} unread contact messages`,
      icon: Mail,
      accent: "bg-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red">Admin Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white sm:text-3xl">
            Welcome back, {admin?.name || "Admin"}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Live overview of your content, audience, and recent operations.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchDashboard}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <Panel title="Publishing Health" icon={BarChart3}>
          <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
            <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-gray-100 dark:border-gray-700">
              <div
                className="absolute inset-[-8px] rounded-full"
                style={{
                  background: `conic-gradient(#dc2626 ${publishingRate * 3.6}deg, ${isDarkMode ? "#374151" : "#e5e7eb"} 0deg)`,
                  WebkitMask: "radial-gradient(circle, transparent 55%, black 57%)",
                  mask: "radial-gradient(circle, transparent 55%, black 57%)",
                }}
              />
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-950 dark:text-white">{publishingRate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">published</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["News", stats.publishedNews, stats.totalNews],
                ["Blogs", stats.publishedBlogs, stats.totalBlogs],
                ["Videos", stats.publishedVideos, stats.totalVideos],
              ].map(([label, published, total]) => (
                <div key={label} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/60">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="mt-2 text-xl font-bold text-gray-950 dark:text-white">
                    {formatNumber(published)}
                    <span className="text-sm font-medium text-gray-400"> / {formatNumber(total)}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Recent Activity" icon={Activity}>
          {dashboard.recentActivities.length ? (
            <div className="space-y-3">
              {dashboard.recentActivities.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {item.entityTitle || item.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.adminName || "Admin"} - {item.action} - {formatDate(item.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No recent activity yet" />
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Latest Content" icon={Newspaper}>
          {dashboard.recentContent.length ? (
            <div className="space-y-3">
              {dashboard.recentContent.map((item) => (
                <div key={`${item.type}-${item.id}`} className="rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {item.type} - {formatDate(item.date)}
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No content found" />
          )}
        </Panel>

        <Panel title="New Users" icon={Users}>
          {dashboard.recentUsers.length ? (
            <div className="space-y-3">
              {dashboard.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red text-sm font-bold text-white">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email || formatDate(user.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No users found" />
          )}
        </Panel>

        <Panel title="Contact Inbox" icon={Mail}>
          {dashboard.recentMessages.length ? (
            <div className="space-y-3">
              {dashboard.recentMessages.map((message) => (
                <div key={message.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{message.subject}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                      message.status === "unread"
                        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {message.name} - {formatDate(message.date)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No messages found" />
          )}
        </Panel>
      </div>
    </div>
  );
}
