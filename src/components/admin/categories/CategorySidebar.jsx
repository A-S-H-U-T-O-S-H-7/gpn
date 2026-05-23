"use client";

import { Save, Trash2, Eye } from "lucide-react";

export default function CategorySidebar({ formData, onSubmit, onDelete, isLoading, isEditMode, isDark }) {
  const getButtonText = () => {
    if (isLoading) return isEditMode ? "Updating..." : "Creating...";
    return isEditMode ? "Update Category" : "Create Category";
  };

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Eye className={`w-4 h-4 text-red`} />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Preview
          </h3>
        </div>

        <div className="text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white"
            style={{ backgroundColor: formData.color || '#ff2b2b' }}
          >
            <span className="text-lg">{formData.iconEmoji || '📁'}</span>
            <span className="font-medium">{formData.name || 'Category Name'}</span>
          </div>
          {formData.description && (
            <p className={`text-sm mt-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {formData.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
            <span>Slug: {formData.slug || 'category-slug'}</span>
            <span>•</span>
            <span>Order: {formData.order || 0}</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          isEditMode
            ? "bg-red hover:bg-red-600 text-white shadow-lg"
            : "bg-red hover:bg-red-600 text-white shadow-lg"
        }`}
      >
        <Save className="w-4 h-4" />
        <span>{getButtonText()}</span>
      </button>

      {/* Delete Button (Edit Mode Only) */}
      {isEditMode && (
        <button
          onClick={onDelete}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            isDark
              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-500/40"
              : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-300"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Category</span>
        </button>
      )}
    </div>
  );
}