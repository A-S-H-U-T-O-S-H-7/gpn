"use client";

import { useState } from "react";
import { Edit, Trash2, Eye, Ban, CheckCircle, Mail, Bell, BellOff } from "lucide-react";
import Image from "next/image";

export default function UsersTableRow({ user, index, currentPage, itemsPerPage, isDark, onView, onBlock, onDelete, onToggleSubscription }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700";
      case 'blocked':
        return isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700";
      default:
        return isDark ? "bg-gray-700/30 text-gray-300" : "bg-gray-100 text-gray-700";
    }
  };

  const handleToggleSubscription = async () => {
    setIsUpdating(true);
    await onToggleSubscription(user.id, !user.isSubscribed);
    setIsUpdating(false);
  };

  return (
    <tr
      className={`border-b transition-colors ${
        isDark
          ? `${index % 2 === 0 ? "bg-gray-900/35" : "bg-gray-800/75"} border-red-500/25 hover:bg-red-950/20`
          : `${index % 2 === 0 ? "bg-white" : "bg-gray-100/70"} border-red-200 hover:bg-red-50`
      }`}
    >
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              {user.name}
            </div>
            <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {user.email}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {formatDate(user.createdAt)}
        </div>
        </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {formatDate(user.lastLoginAt)}
        </div>
        </td>
      
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
          {user.status === 'active' ? 'Active' : user.status === 'blocked' ? 'Blocked' : user.status}
        </span>
        </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {user.isSubscribed ? (
            <>
              <Bell className="w-4 h-4 text-green-500" />
              <span className={`text-sm font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>
                Yes
              </span>
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4 text-gray-400" />
              <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                No
              </span>
            </>
          )}
        </div>
        </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(user)}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToggleSubscription}
            disabled={isUpdating}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              user.isSubscribed
                ? isDark
                  ? "bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50"
                  : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                : isDark
                  ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title={user.isSubscribed ? "Unsubscribe" : "Subscribe"}
          >
            {user.isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onBlock(user)}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              user.status === 'blocked'
                ? isDark
                  ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
                : isDark
                  ? "bg-orange-900/30 text-orange-400 hover:bg-orange-900/50"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
            }`}
            title={user.status === 'blocked' ? "Unblock User" : "Block User"}
          >
            {user.status === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onDelete(user)}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        </td>
    </tr>
  );
}