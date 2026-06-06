"use client";

import { FileText, Globe, Hash } from "lucide-react";
import RichTextEditor from "@/components/admin/blogs/RichTextEditor";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function NewsForm({ formData, errors, onInputChange, isDark }) {
  const handleTitleChange = (value) => {
    onInputChange("title", value);
    if (!formData.manualSlug) {
      onInputChange("url", generateSlug(value));
    }
    if (formData.manualSlug) {
      onInputChange("manualSlug", false);
    }
  };

  const handleSlugChange = (value) => {
    onInputChange("url", value);
    onInputChange("manualSlug", true);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <FileText className={`w-4 h-4 text-red`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Basic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              News Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                errors.title
                  ? "border-red-500"
                  : isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="Enter news title..."
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                errors.url
                  ? "border-red-500"
                  : isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="news-url-slug"
            />
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <FileText className={`w-4 h-4 text-red`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            News Content
          </h2>
        </div>

        <RichTextEditor
          value={formData.content}
          onChange={(content) => onInputChange("content", content)}
          placeholder="Write your news content here..."
          isDark={isDark}
        />
        {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
      </div>

      {/* SEO Settings */}
      {/* SEO Settings */}
<div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
  <div className="flex items-center gap-2 mb-4">
    <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
      <Globe className={`w-4 h-4 text-red`} />
    </div>
    <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
      SEO Settings
    </h2>
  </div>

  <div className="space-y-4">
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        Meta Title *
      </label>
      <input
        type="text"
        value={formData.metatitle}
        onChange={(e) => onInputChange("metatitle", e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
          errors.metatitle
            ? "border-red-500"
            : isDark
              ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
              : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
        }`}
        placeholder="Enter meta title..."
      />
      {errors.metatitle && <p className="text-red-500 text-sm mt-1">{errors.metatitle}</p>}
    </div>

    <div>
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        Meta Description *
      </label>
      <textarea
        value={formData.metadesc}
        onChange={(e) => onInputChange("metadesc", e.target.value)}
        rows={2}
        className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 resize-none focus:ring-2 focus:ring-red/20 focus:outline-none ${
          errors.metadesc
            ? "border-red-500"
            : isDark
              ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
              : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
        }`}
        placeholder="Enter meta description..."
      />
      {errors.metadesc && <p className="text-red-500 text-sm mt-1">{errors.metadesc}</p>}
    </div>

    {/* ADD THIS - Meta Keywords */}
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        <div className="flex items-center gap-1">
          <Hash className="w-3.5 h-3.5" />
          Meta Keywords
        </div>
      </label>
      <input
        type="text"
        value={formData.metakeywords || ''}
        onChange={(e) => onInputChange("metakeywords", e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
          isDark
            ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
            : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
        }`}
        placeholder="news, politics, sports, technology"
      />
      <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Enter keywords separated by commas for better SEO
      </p>
    </div>
  </div>
</div>
    </div>
  );
}