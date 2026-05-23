"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Calendar, User, FileText, Eye, Trash2, Edit, Star, TrendingUp, Zap } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import { getActivityLogs, ActivityActions, ActivityEntityTypes } from "@/lib/services/activityLogService";
import Pagination from "./Pagination";

const actionIcons = {
  [ActivityActions.CREATE]: { icon: FileText, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  [ActivityActions.UPDATE]: { icon: Edit, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  [ActivityActions.DELETE]: { icon: Trash2, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  [ActivityActions.PUBLISH]: { icon: Eye, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  [ActivityActions.TRENDING_ON]: { icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  [ActivityActions.TRENDING_OFF]: { icon: TrendingUp, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/30" },
  [ActivityActions.EDITOR_PICK_ON]: { icon: Star, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  [ActivityActions.EDITOR_PICK_OFF]: { icon: Star, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/30" },
  [ActivityActions.BREAKING_ON]: { icon: Zap, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  [ActivityActions.BREAKING_OFF]: { icon: Zap, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/30" },
};

const getActionText = (action) => {
  const texts = {
    [ActivityActions.CREATE]: "Created",
    [ActivityActions.UPDATE]: "Updated",
    [ActivityActions.DELETE]: "Deleted",
    [ActivityActions.PUBLISH]: "Published",
    [ActivityActions.UNPUBLISH]: "Unpublished",
    [ActivityActions.TRENDING_ON]: "Marked as Trending",
    [ActivityActions.TRENDING_OFF]: "Removed from Trending",
    [ActivityActions.EDITOR_PICK_ON]: "Added to Editor's Pick",
    [ActivityActions.EDITOR_PICK_OFF]: "Removed from Editor's Pick",
    [ActivityActions.BREAKING_ON]: "Marked as Breaking",
    [ActivityActions.BREAKING_OFF]: "Removed from Breaking",
    [ActivityActions.LOGIN]: "Logged In",
    [ActivityActions.LOGOUT]: "Logged Out",
  };
  return texts[action] || action;
};

export default function ActivityLogsPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    action: "all",
    entityType: "all",
    search: "",
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getActivityLogs(currentPage, filters);
      if (result.success) {
        setLogs(result.logs);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="pt-1">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track all admin activities and changes across the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or admin name..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-red/20 focus:outline-none ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white focus:border-red"
                : "bg-white border-gray-200 text-gray-900 focus:border-red"
            }`}
          />
        </div>

        <select
          value={filters.action}
          onChange={(e) => handleFilterChange("action", e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white focus:border-red"
              : "bg-white border-gray-200 text-gray-900 focus:border-red"
          }`}
        >
          <option value="all">All Actions</option>
          <option value={ActivityActions.CREATE}>Create</option>
          <option value={ActivityActions.UPDATE}>Update</option>
          <option value={ActivityActions.DELETE}>Delete</option>
          <option value={ActivityActions.PUBLISH}>Publish</option>
          <option value={ActivityActions.TRENDING_ON}>Trending On</option>
          <option value={ActivityActions.TRENDING_OFF}>Trending Off</option>
          <option value={ActivityActions.EDITOR_PICK_ON}>Editor's Pick On</option>
          <option value={ActivityActions.EDITOR_PICK_OFF}>Editor's Pick Off</option>
          <option value={ActivityActions.BREAKING_ON}>Breaking On</option>
          <option value={ActivityActions.BREAKING_OFF}>Breaking Off</option>
        </select>

        <select
          value={filters.entityType}
          onChange={(e) => handleFilterChange("entityType", e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white focus:border-red"
              : "bg-white border-gray-200 text-gray-900 focus:border-red"
          }`}
        >
          <option value="all">All Types</option>
          <option value={ActivityEntityTypes.NEWS}>News</option>
          <option value={ActivityEntityTypes.BLOG}>Blog</option>
          <option value={ActivityEntityTypes.VIDEO}>Video</option>
          <option value={ActivityEntityTypes.CATEGORY}>Category</option>
          <option value={ActivityEntityTypes.ADMIN}>Admin</option>
        </select>
      </div>

      {/* Total Records */}
      {!loading && logs.length > 0 && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Total: {totalItems} log{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className={`rounded-xl border p-12 text-center ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No activity logs found</p>
          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Activities will appear here as admins perform actions
          </p>
        </div>
      ) : (
        <>
          {/* Logs Timeline */}
          <div className="space-y-4">
            {logs.map((log) => {
              const ActionIcon = actionIcons[log.action]?.icon || FileText;
              const iconColor = actionIcons[log.action]?.color || "text-gray-500";
              const iconBg = actionIcons[log.action]?.bg || (isDarkMode ? "bg-gray-700" : "bg-gray-100");
              
              return (
                <div
                  key={log.id}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-800/80"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${iconBg}`}>
                      <ActionIcon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {getActionText(log.action)}
                          </span>
                          {log.entityTitle && (
                            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {" "}
                              <span className="font-medium text-red">“{log.entityTitle}”</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{log.adminName || "Unknown"}</span>
                          <span className="text-gray-400">•</span>
                          <span>{log.adminRole === "super_admin" ? "Super Admin" : log.adminRole}</span>
                        </div>
                      </div>
                      
                      {/* Details */}
                      {log.details && (
                        <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {log.details}
                        </p>
                      )}
                      
                      {/* Timestamp */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(log.timestamp)}</span>
                        {log.ipAddress && log.ipAddress !== "unknown" && (
                          <>
                            <span>•</span>
                            <span>IP: {log.ipAddress}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isDark={isDarkMode}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}