"use client";

import { useState } from "react";
import { Search, FileText, Tag, Code, Save } from "lucide-react";

export default function SeoSettings({ settings, onUpdate, isDark }) {
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
            <Search className="w-5 h-5 text-red" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            SEO Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Meta Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="Enter meta title"
              />
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Recommended length: 50-60 characters. Currently: {formData.metaTitle?.length || 0}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 resize-none ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              placeholder="Enter meta description"
            />
            <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Recommended length: 150-160 characters. Currently: {formData.metaDescription?.length || 0}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Meta Keywords
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Separate keywords with commas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Google Analytics ID
              </label>
              <div className="relative">
                <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.googleAnalyticsId}
                  onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Google Site Verification
              </label>
              <input
                type="text"
                value={formData.googleSiteVerification}
                onChange={(e) => handleChange('googleSiteVerification', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="Enter verification code"
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
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}