"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ScheduleModal({ isOpen, onClose, onSave, editingItem, isDark }) {
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || "",
        startTime: editingItem.startTime || "",
        endTime: editingItem.endTime || "",
        category: editingItem.category || "",
        description: editingItem.description || "",
      });
    } else {
      setFormData({
        title: "",
        startTime: "",
        endTime: "",
        category: "",
        description: "",
      });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startTime) {
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`rounded-xl w-full max-w-md p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-2xl`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingItem ? "Edit Schedule" : "Add Schedule"}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-all ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Program Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="Enter program title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                }`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="e.g., News, Sports, Entertainment"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none resize-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="Brief description of the program"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all"
            >
              {editingItem ? "Update" : "Add"} Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}