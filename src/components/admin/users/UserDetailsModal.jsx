"use client";

import { X, Mail, Calendar, Clock, Bell, User as UserIcon, Shield } from "lucide-react";

export default function UserDetailsModal({ isOpen, onClose, user, isDark }) {
  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700" />
        
        <div className="flex items-center justify-between p-5 pb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDark ? "bg-red-900/30" : "bg-red-100"}`}>
              <UserIcon className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              User Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 pt-2">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600">
                  <span className="text-3xl font-bold text-white">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-4">
            <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {user.name}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                user.status === 'active'
                  ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
                  : isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
              }`}>
                {user.status === 'active' ? 'Active' : 'Blocked'}
              </span>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                user.isSubscribed
                  ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
                  : isDark ? "bg-gray-700/30 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}>
                {user.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Registered On</p>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatDate(user.lastLoginAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Bell className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Newsletter Subscription</p>
                <p className={`text-sm font-medium ${user.isSubscribed ? "text-green-600" : "text-gray-500"}`}>
                  {user.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}