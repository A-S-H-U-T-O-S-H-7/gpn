"use client";

import { useState } from "react";
import { Globe, Mail, Clock, Calendar, Save } from "lucide-react";

export default function GeneralSettings({ settings, onUpdate, isDark }) {
  const [formData, setFormData] = useState(settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onUpdate(formData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`rounded-xl border-2 p-6 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Globe className="w-5 h-5 text-red" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            General Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Site Name
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Site Tagline
              </label>
              <input
                type="text"
                value={formData.siteTagline}
                onChange={(e) => handleChange('siteTagline', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Site Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.siteEmail}
                  onChange={(e) => handleChange('siteEmail', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Timezone
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Europe/Paris">Europe/Paris (CET)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Date Format
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={formData.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="MMM DD, YYYY">Jan 15, 2024</option>
                  <option value="MMMM DD, YYYY">January 15, 2024</option>
                  <option value="DD/MM/YYYY">15/01/2024</option>
                  <option value="MM/DD/YYYY">01/15/2024</option>
                  <option value="YYYY-MM-DD">2024-01-15</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}