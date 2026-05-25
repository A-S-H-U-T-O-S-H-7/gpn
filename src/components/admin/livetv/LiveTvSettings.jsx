"use client";

import { Tv, Eye, Save } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

export default function LiveTvSettings({ settings, onSettingsChange, onSave, saving, isDark }) {
  return (
    <div className={`rounded-xl border-2 p-6 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
          <Tv className={`w-5 h-5 text-red`} />
        </div>
        <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
          Live Stream Settings
        </h2>
      </div>

      <div className="space-y-4">
        {/* Live Status Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-red-200 dark:border-red-800">
          <div>
            <h3 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>Live Status</h3>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Toggle to start/stop live broadcast
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.isLive === true}
              onChange={(e) => onSettingsChange("isLive", e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red"></div>
          </label>
        </div>

        {/* YouTube URL */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            YouTube Live URL
          </label>
          <div className="relative">
            <FaYoutube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={settings.youtubeUrl || ""}
              onChange={(e) => onSettingsChange("youtubeUrl", e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Enter the YouTube Live stream URL
          </p>
        </div>

        {/* Stream Title */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Stream Title
          </label>
          <input
            type="text"
            value={settings.title || ""}
            onChange={(e) => onSettingsChange("title", e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
              isDark
                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
            }`}
            placeholder="GPN Live News - Breaking News Coverage"
          />
        </div>

        {/* Description */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Description
          </label>
          <textarea
            value={settings.description || ""}
            onChange={(e) => onSettingsChange("description", e.target.value)}
            rows={2}
            className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none resize-none ${
              isDark
                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
            }`}
            placeholder="Live coverage of global events..."
          />
        </div>

        {/* Viewers & Quality */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Viewers Count
            </label>
            <div className="relative">
              <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={settings.viewers || "0"}
                onChange={(e) => onSettingsChange("viewers", e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                }`}
                placeholder="24.5K"
              />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Quality
            </label>
            <select
              value={settings.quality || "1080p"}
              onChange={(e) => onSettingsChange("quality", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
            >
              <option value="1080p">1080p (Full HD)</option>
              <option value="720p">720p (HD)</option>
              <option value="480p">480p (SD)</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-red hover:bg-red-600 text-white shadow-lg`}
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>
    </div>
  );
}