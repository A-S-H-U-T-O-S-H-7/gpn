"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import CategoryTable from "@/components/admin/categories/CategoryTable";
import { getCategories, deleteCategory } from "@/lib/services/categoryService";
import Swal from "sweetalert2";

export default function AdminCategoriesPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCategories();
      if (result.success) {
        setCategories(result.categories);
      } else {
        toast.error(result.error || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = () => {
    router.push("/admin/categories/manage/new");
  };

  const handleEditCategory = (categoryId) => {
    router.push(`/admin/categories/manage/${categoryId}`);
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete category "${categoryName}"`,
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
        const deleteResult = await deleteCategory(categoryId, categoryName, admin);
        if (deleteResult.success) {
          toast.success("Category deleted successfully");
          fetchCategories();
        } else {
          toast.error(deleteResult.error || "Failed to delete category");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete category");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>Categories</h1>
            <p className={` text-sm ${isDarkMode ? 'text-gray-50' : 'text-gray-700'} mt-1`}>Manage categories for News, Blogs, and Videos</p>
          </div>
        </div>
        <button
          onClick={handleCreateCategory}
          className="flex items-center gap-2 px-4 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </button>
      </div>

      {/* Total Records */}
      {categories.length > 0 && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Total: {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
        </div>
      )}

      {/* Categories Table */}
      <CategoryTable
        categories={categories}
        isDark={isDarkMode}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        isUpdating={isUpdating}
      />
    </div>
  );
}