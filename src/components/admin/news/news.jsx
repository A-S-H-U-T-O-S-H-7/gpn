"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import NewsTable from "./NewsTable";
import { getNews, deleteNews } from "@/lib/services/newsService";
import Swal from "sweetalert2";

export default function AdminNewsPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getNews(currentPage, searchTerm, statusFilter, typeFilter);
      if (result.success) {
        setNews(result.news);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || "Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleCreateNews = () => {
    router.push("/admin/news/manage/new");
  };

  const handleEditNews = (newsId) => {
    router.push(`/admin/news/manage/${newsId}`);
  };

  const handleDeleteNews = async (newsId, newsTitle, newsImage) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${newsTitle}"`,
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
        const deleteResult = await deleteNews(newsId, newsTitle, newsImage, admin);
        if (deleteResult.success) {
          toast.success("News deleted successfully");
          fetchNews();
        } else {
          toast.error(deleteResult.error || "Failed to delete news");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete news");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>News</h1>
            <p className={` text-sm ${isDarkMode ? 'text-gray-50' : 'text-gray-700'} mt-1`}>Manage your News</p>
          </div>
        </div>
        <button
          onClick={handleCreateNews}
          className="flex items-center gap-2 px-4 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create News
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search news by title..."
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
          onChange={(e) => setStatusFilter(e.target.value)}
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

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-red-500/40 text-white focus:border-red"
              : "bg-white border-red-300 text-gray-900 focus:border-red"
          }`}
        >
          <option value="all">All Types</option>
          <option value="breaking">Breaking News</option>
          <option value="trending">Trending</option>
          <option value="editor_pick">Editor's Pick</option>
        </select>
      </div>

      {/* Total Records */}
      {!loading && news.length > 0 && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Total: {totalItems} news article{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <NewsTable
          news={news}
          currentPage={currentPage}
          totalPages={totalPages}
          isUpdating={isUpdating}
          isDark={isDarkMode}
          onEdit={handleEditNews}
          onDelete={handleDeleteNews}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}