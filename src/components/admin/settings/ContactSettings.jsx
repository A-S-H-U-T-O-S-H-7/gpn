"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Save } from "lucide-react";

export default function ContactSettings({ settings, onUpdate, isDark }) {
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
            <Phone className="w-5 h-5 text-red" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Contact Information
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Phone Number 1
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone1 || ""}
                  onChange={(e) => handleChange('phone1', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Phone Number 2 (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone2 || ""}
                  onChange={(e) => handleChange('phone2', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                  placeholder="contact@gpn.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Support Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.siteEmail || ""}
                  onChange={(e) => handleChange('siteEmail', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                  placeholder="info@gpn.com"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Office Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                value={formData.address || ""}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 resize-none ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="Great Post News, New Delhi, India - 110001"
              />
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
            {isLoading ? "Saving..." : "Save Contact Info"}
          </button>
        </div>
      </div>
    </form>
  );
}