"use client";

import { X, Building, User, Mail, Phone, Globe, DollarSign, Calendar, MessageSquare } from "lucide-react";

export default function AdvertiseModal({ isOpen, onClose, inquiry, isDark }) {
  if (!isOpen || !inquiry) return null;

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

  const getAdTypeLabel = (type) => {
    const types = {
      display: "Display Banner",
      video: "Video Ad",
      native: "Native Ad",
      newsletter: "Newsletter Ad",
      sponsored: "Sponsored Article",
    };
    return types[type] || type;
  };

  const getBudgetLabel = (budget) => {
    const budgets = {
      below_10000: "Below ₹10,000",
      "10000_25000": "₹10,000 - ₹25,000",
      "25000_50000": "₹25,000 - ₹50,000",
      "50000_100000": "₹50,000 - ₹1,00,000",
      above_100000: "Above ₹1,00,000",
    };
    return budgets[budget] || budget;
  };

  const getDurationLabel = (duration) => {
    const durations = {
      "1_week": "1 Week",
      "2_weeks": "2 Weeks",
      "1_month": "1 Month",
      "3_months": "3 Months",
      "6_months": "6 Months",
      "1_year": "1 Year",
    };
    return durations[duration] || duration;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'contacted':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case 'approved':
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case 'rejected':
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700";
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
              <Building className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Advertising Inquiry Details
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

        <div className="p-5 pt-2 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Company Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{inquiry.companyName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contact Person</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{inquiry.contactPerson}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{inquiry.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{inquiry.phone}</p>
              </div>
            </div>

            {inquiry.website && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 md:col-span-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                  <a href={inquiry.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                    {inquiry.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Ad Type</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{getAdTypeLabel(inquiry.adType)}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Budget Range</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{getBudgetLabel(inquiry.budget)}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{getDurationLabel(inquiry.duration)}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
              {inquiry.status === 'pending' ? 'Pending' : inquiry.status === 'contacted' ? 'Contacted' : inquiry.status === 'approved' ? 'Approved' : 'Rejected'}
            </span>
          </div>

          {/* Message */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Message / Requirements</p>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {inquiry.message}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Submitted On</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(inquiry.createdAt)}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(inquiry.updatedAt)}</p>
            </div>
          </div>

          {/* Reply Button */}
          <div className="pt-2">
            <a
              href={`mailto:${inquiry.email}?subject=Advertising Inquiry: ${inquiry.companyName}`}
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