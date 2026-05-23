"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import BlogTable from "@/components/admin/blogs/BlogTable";
import { getBlogs, deleteBlog } from "@/lib/services/blogService";
import Swal from "sweetalert2";

export default function AdminBlogsPage() {
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getBlogs(currentPage, searchTerm, statusFilter);
      if (result.success) {
        setBlogs(result.blogs);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleCreateBlog = () => {
    router.push("/admin/blogs/manage/new");
  };

  const handleEditBlog = (blogId) => {
    router.push(`/admin/blogs/manage/${blogId}`);
  };

  const handleDeleteBlog = async (blogId, blogTitle, blogImage) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${blogTitle}"`,
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
        const deleteResult = await deleteBlog(blogId, blogImage);
        if (deleteResult.success) {
          toast.success("Blog deleted successfully");
          fetchBlogs();
        } else {
          toast.error(deleteResult.error || "Failed to delete blog");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete blog");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className={`mt-0.5 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              isDarkMode
                ? "border-rose-500/60 text-rose-600 bg-rose-100 hover:bg-rose-950/40"
                : "border-rose-300 text-rose-600 bg-rose-200 hover:bg-rose-50"
            }`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-50' : 'text-gray-950'}`}>Blogs</h1>
            <p className={`text-gray-600 ${isDarkMode ? 'dark:text-gray-300' : 'text-gray-500'} mt-1`}>Manage your blog posts</p>
          </div>
        </div>
        <button
          onClick={handleCreateBlog}
          className="flex items-center gap-2 px-4 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Blog
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs by title..."
            value={searchTerm}
            onChange={handleSearch}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-red/20 focus:outline-none ${
              isDarkMode
                ? "bg-gray-800 border-rose-500/60 text-white focus:border-rose-400"
                : "bg-white border-rose-300 text-gray-900 focus:border-rose-500"
            }`}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-rose-500/60 text-white focus:border-rose-400"
              : "bg-white border-rose-300 text-gray-900 focus:border-rose-500"
          }`}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Total Records */}
      {!loading && blogs.length > 0 && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Total: {totalItems} blog{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <BlogTable
          blogs={blogs}
          currentPage={currentPage}
          totalPages={totalPages}
          isUpdating={isUpdating}
          isDark={isDarkMode}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}