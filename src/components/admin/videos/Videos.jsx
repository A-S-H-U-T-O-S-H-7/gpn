"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import VideoTable from "@/components/admin/videos/VideoTable";
import { getVideos, deleteVideo } from "@/lib/services/videoService";
import Swal from "sweetalert2";

export default function AdminVideosPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [videoTypeFilter, setVideoTypeFilter] = useState("all"); // NEW
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getVideos(
        currentPage, 
        searchTerm, 
        statusFilter, 
        featuredFilter,
        videoTypeFilter // NEW
      );
      if (result.success) {
        setVideos(result.videos);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || "Failed to fetch videos");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, featuredFilter, videoTypeFilter]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleCreateVideo = () => {
    router.push("/admin/videos/manage/new");
  };

  const handleEditVideo = (videoId) => {
    router.push(`/admin/videos/manage/${videoId}`);
  };

  const handleDeleteVideo = async (videoId, videoTitle) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${videoTitle}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff2b2b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        const deleteResult = await deleteVideo(videoId, videoTitle, admin);
        if (deleteResult.success) {
          toast.success("Video deleted successfully");
          fetchVideos();
        } else {
          toast.error(deleteResult.error || "Failed to delete video");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete video");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className={`mt-0.5 p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              isDarkMode
                ? "border-red-500/60 text-red-500 bg-red-200 hover:bg-red-950/40"
                : "border-red-300 text-red-600 bg-red-200 hover:bg-red-50"
            }`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>Videos</h1>
            <p className={` text-sm ${isDarkMode ? 'text-gray-50' : 'text-gray-700'} mt-1`}>Manage your video content</p>
          </div>
        </div>
        <button
          onClick={handleCreateVideo}
          className="flex items-center gap-2 px-4 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos by title..."
            value={searchTerm}
            onChange={handleSearch}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
              isDarkMode
                ? "bg-gray-800 border-red-500/40 text-white focus:border-red"
                : "bg-white border-red-300 text-gray-900 focus:border-red"
            }`}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={handleFilterChange(setStatusFilter)}
          className={`px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-red-500/40 text-white focus:border-red"
              : "bg-white border-red-300 text-gray-900 focus:border-red"
          }`}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        {/* NEW: Video Type Filter */}
        <select
          value={videoTypeFilter}
          onChange={handleFilterChange(setVideoTypeFilter)}
          className={`px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-red-500/40 text-white focus:border-red"
              : "bg-white border-red-300 text-gray-900 focus:border-red"
          }`}
        >
          <option value="all">All Types</option>
          <option value="standard">📹 Standard</option>
          <option value="short">📱 Shorts</option>
          <option value="reel">🎬 Reels</option>
        </select>

        <select
          value={featuredFilter}
          onChange={handleFilterChange(setFeaturedFilter)}
          className={`px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-red-500/40 text-white focus:border-red"
              : "bg-white border-red-300 text-gray-900 focus:border-red"
          }`}
        >
          <option value="all">All Videos</option>
          <option value="featured">⭐ Featured</option>
          <option value="editor_pick">📝 Editor's Pick</option>
          <option value="trending">🔥 Trending</option>
          <option value="hero">🏆 Hero</option>
          <option value="top10">🔝 Top 10</option>
          <option value="normal">📋 Normal</option>
        </select>
      </div>

      {/* Total Records */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Total: {totalItems} video{totalItems !== 1 ? 's' : ''}
          {videoTypeFilter !== 'all' && ` (${videoTypeFilter})`}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <VideoTable
          videos={videos}
          currentPage={currentPage}
          totalPages={totalPages}
          isUpdating={isUpdating}
          isDark={isDarkMode}
          onEdit={handleEditVideo}
          onDelete={handleDeleteVideo}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}