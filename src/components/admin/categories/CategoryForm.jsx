"use client";

import { useState } from "react";
import { FolderOpen, Globe, Hash, Eye, Star, Palette } from "lucide-react";
import { categoryIcons } from "@/lib/services/categoryService";

const colorOptions = [
  { value: "#ff2b2b", label: "GPN Red", class: "bg-[#ff2b2b]" },
  { value: "#3b82f6", label: "Blue", class: "bg-blue-500" },
  { value: "#10b981", label: "Green", class: "bg-green-500" },
  { value: "#f59e0b", label: "Orange", class: "bg-amber-500" },
  { value: "#8b5cf6", label: "Purple", class: "bg-purple-500" },
  { value: "#ec4899", label: "Pink", class: "bg-pink-500" },
  { value: "#ef4444", label: "Red", class: "bg-red-500" },
  { value: "#06b6d4", label: "Cyan", class: "bg-cyan-500" },
];

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function CategoryForm({ formData, errors, onInputChange, isDark }) {
  const handleNameChange = (value) => {
    onInputChange("name", value);
    if (!formData.manualSlug) {
      onInputChange("slug", generateSlug(value));
    }
    if (formData.manualSlug) {
      onInputChange("manualSlug", false);
    }
  };

  const handleSlugChange = (value) => {
    onInputChange("slug", value);
    onInputChange("manualSlug", true);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <FolderOpen className={`w-4 h-4 text-red`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Basic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                errors.name
                  ? "border-red-500"
                  : isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="Enter category name..."
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                errors.slug
                  ? "border-red-500"
                  : isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="category-slug"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Description
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => onInputChange("description", e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none resize-none ${
              isDark
                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
            }`}
            placeholder="Brief description of this category..."
          />
        </div>
      </div>

      {/* Icon & Color */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Palette className={`w-4 h-4 text-red`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Icon & Color
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Icon
            </label>
            <select
              value={formData.icon || "Globe"}
              onChange={(e) => onInputChange("icon", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
            >
              {categoryIcons.map(icon => (
                <option key={icon.value} value={icon.value}>
                  {icon.icon} {icon.label}
                </option>
              ))}
            </select>
            <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Icon will appear in white color with the selected background
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Icon Background Color *
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => onInputChange("backgroundColor", color.value)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${color.class} ${
                    formData.backgroundColor === color.value ? "ring-2 ring-offset-2 ring-red scale-110" : ""
                  }`}
                  title={color.label}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.backgroundColor || "#ff2b2b"}
                onChange={(e) => onInputChange("backgroundColor", e.target.value)}
                className="w-12 h-10 rounded border-2 cursor-pointer"
              />
              <input
                type="text"
                value={formData.backgroundColor || "#ff2b2b"}
                onChange={(e) => onInputChange("backgroundColor", e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-700 border-red-500/40 text-white"
                    : "bg-gray-50 border-red-300 text-gray-900"
                }`}
                placeholder="#ff2b2b"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Eye className={`w-4 h-4 text-red`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Display Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Display Order
            </label>
            <input
              type="number"
              value={formData.order || 0}
              onChange={(e) => onInputChange("order", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              min="0"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Status
            </label>
            <select
              value={formData.status || "active"}
              onChange={(e) => onInputChange("status", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Featured
            </label>
            <div className="flex items-center h-10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => onInputChange("featured", e.target.checked)}
                  className="w-4 h-4 text-red rounded border-gray-300 focus:ring-red"
                />
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Show on homepage
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}