"use client";

import { useState } from "react";
import { Palette, Type, Moon, Sun, Save } from "lucide-react";

export default function AppearanceSettings({ settings, onUpdate, isDark }) {
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

  const colorOptions = [
    { value: '#ff2b2b', label: 'GPN Red', class: 'bg-[#ff2b2b]' },
    { value: '#dc2626', label: 'Red', class: 'bg-red-600' },
    { value: '#3b82f6', label: 'Blue', class: 'bg-blue-500' },
    { value: '#10b981', label: 'Green', class: 'bg-green-500' },
    { value: '#8b5cf6', label: 'Purple', class: 'bg-purple-500' },
    { value: '#f59e0b', label: 'Orange', class: 'bg-amber-500' },
    { value: '#ec4899', label: 'Pink', class: 'bg-pink-500' },
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Georgia', label: 'Georgia' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`rounded-xl border-2 p-6 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Palette className="w-5 h-5 text-red" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Appearance Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Primary Color
            </label>
            <div className="flex gap-3 flex-wrap mb-3">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleChange('primaryColor', color.value)}
                  className={`w-10 h-10 rounded-full transition-all duration-200 ${color.class} ${
                    formData.primaryColor === color.value ? "ring-2 ring-offset-2 ring-red scale-110" : ""
                  }`}
                  title={color.label}
                />
              ))}
            </div>
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              placeholder="#ff2b2b"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Font Family
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={formData.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Default Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleChange('darkMode', 'light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  formData.darkMode === 'light'
                    ? "border-red bg-red/10"
                    : isDark
                      ? "border-gray-600 hover:border-red/50"
                      : "border-gray-300 hover:border-red/50"
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange('darkMode', 'dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  formData.darkMode === 'dark'
                    ? "border-red bg-red/10"
                    : isDark
                      ? "border-gray-600 hover:border-red/50"
                      : "border-gray-300 hover:border-red/50"
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange('darkMode', 'system')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  formData.darkMode === 'system'
                    ? "border-red bg-red/10"
                    : isDark
                      ? "border-gray-600 hover:border-red/50"
                      : "border-gray-300 hover:border-red/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>System</span>
              </button>
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