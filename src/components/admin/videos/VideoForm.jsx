"use client";

import { useState, useEffect } from "react";
import { Video, Clock, Tag, FileText, Globe, Hash } from "lucide-react";
import RichTextEditor from "@/components/admin/blogs/RichTextEditor";
import { FaYoutube } from "react-icons/fa";
import AIGenerateButton from "@/components/admin/AIGenerateButton";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function VideoForm({ formData, errors, onInputChange, isDark }) {
  const [tagsInput, setTagsInput] = useState(formData.tags?.join(', ') || '');

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

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onInputChange("tags", tagsArray);
  };

  // Update tagsInput when formData.tags changes from AI
  useEffect(() => {
    if (formData.tags && Array.isArray(formData.tags)) {
      setTagsInput(formData.tags.join(', '));
    }
  }, [formData.tags]);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Video className={`w-4 h-4 text-red`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Basic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Video Title *
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
              placeholder="Enter video title..."
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
              placeholder="video-url-slug"
            />
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
          </div>
        </div>
      </div>

      {/* YouTube URL */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <FaYoutube className={`w-4 h-4 text-red`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            YouTube URL
          </h2>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            YouTube Video URL *
          </label>
          <input
            type="text"
            value={formData.youtubeUrl}
            onChange={(e) => onInputChange("youtubeUrl", e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
              errors.youtubeUrl
                ? "border-red-500"
                : isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
            }`}
            placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
          />
          {errors.youtubeUrl && <p className="text-red-500 text-sm mt-1">{errors.youtubeUrl}</p>}
        </div>
      </div>

      {/* Video Description with Format Button */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
              <FileText className={`w-4 h-4 text-red`} />
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
              Video Description
            </h2>
          </div>
          {/* <FormatDescriptionButton
            content={formData.description}
            onFormatted={onInputChange}
            size="sm"
          /> */}
        </div>

        <RichTextEditor
          value={formData.description}
          onChange={(content) => onInputChange("description", content)}
          placeholder="Write your video description here..."
          minHeight="200px"
          required={false}
          isDark={isDark}
        />
      </div>

      {/* Tags Section */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
              <Tag className={`w-4 h-4 text-red`} />
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
              Tags
            </h2>
          </div>
          {/* <AIGenerateButton
            content={formData.description || formData.title}
            onGenerated={onInputChange}
            type="tags"
            label="Generate Tags"
            size="sm"
          /> */}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Video Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={handleTagsChange}
            className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
              isDark
                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
            }`}
            placeholder="खान-सर, पटना-न्यूज़, बिहार-न्यूज़, कोचिंग-संस्थान"
          />
          <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Enter tags separated by commas (e.g., tag1, tag2, tag3)
          </p>
        </div>
      </div>

      {/* SEO Settings with AI Generate All Button */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
              <Globe className={`w-4 h-4 text-red`} />
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
              SEO Settings
            </h2>
          </div>
          
          {/* ONE BUTTON TO GENERATE ALL SEO */}
          <AIGenerateButton
            content={formData.description || formData.title}
            onGenerated={onInputChange}
            type="all"
            label="✨ Generate All SEO"
            size="sm"
          />
        </div>

        <div className="space-y-4">
          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Meta Title
              </label>
            </div>
            <input
              type="text"
              value={formData.metatitle || ''}
              onChange={(e) => onInputChange("metatitle", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="Meta title will appear here after AI generation..."
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Meta Description
              </label>
            </div>
            <textarea
              value={formData.metadesc || ''}
              onChange={(e) => onInputChange("metadesc", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 resize-none focus:ring-2 focus:ring-red/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="Meta description will appear here after AI generation..."
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                <div className="flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  Meta Keywords
                </div>
              </label>
            </div>
            <input
              type="text"
              value={formData.metakeywords || ''}
              onChange={(e) => onInputChange("metakeywords", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                  : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
              }`}
              placeholder="Keywords will appear here after AI generation..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}