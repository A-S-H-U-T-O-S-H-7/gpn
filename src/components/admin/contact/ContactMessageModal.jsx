"use client";

import { X, Mail, Phone, User, Calendar, MessageSquare } from "lucide-react";

export default function ContactMessageModal({ isOpen, onClose, message, isDark }) {
  if (!isOpen || !message) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case 'read':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case 'replied':
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700" />
        
        <div className="flex items-center justify-between p-5 pb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDark ? "bg-red-900/30" : "bg-red-100"}`}>
              <MessageSquare className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Message Details
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

        <div className="p-5 pt-2 space-y-4">
          {/* Sender Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{message.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{message.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{message.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(message.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
              {message.status === 'unread' ? 'Unread' : message.status === 'read' ? 'Read' : 'Replied'}
            </span>
          </div>

          {/* Subject */}
          {message.subject && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subject</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{message.subject}</p>
            </div>
          )}

          {/* Message Content */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Message</p>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {message.message}
            </div>
          </div>

          {/* Reply Button */}
          <div className="pt-2">
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your inquiry'}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all"
            >
              <Mail className="w-4 h-4" />
              Reply via Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}