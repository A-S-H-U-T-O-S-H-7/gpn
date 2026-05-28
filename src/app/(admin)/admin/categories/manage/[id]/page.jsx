"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import CategorySidebar from "@/components/admin/categories/CategorySidebar";
import { getCategoryById, createCategory, updateCategory, deleteCategory, generateCategorySlug } from "@/lib/services/categoryService";
import Swal from "sweetalert2";

export default function ManageCategoryPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id;
  const isEditMode = categoryId && categoryId !== "new";

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Globe",
    iconEmoji: "🌍",
    backgroundColor: "#ff2b2b", // ✅ Fix 1
    order: 0,
    status: "active",
    featured: false,
    manualSlug: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const loadCategory = async () => {
        try {
          const result = await getCategoryById(categoryId);
          if (result.success && result.category) {
            const category = result.category;
            setFormData({
              name: category.name || "",
              slug: category.slug || "",
              description: category.description || "",
              icon: category.icon || "Globe",
              iconEmoji: category.iconEmoji || "🌍",
              backgroundColor: category.backgroundColor || "#ff2b2b", // ✅ Fix 2
              order: category.order || 0,
              status: category.status || "active",
              featured: category.featured || false,
              manualSlug: true,
            });
          } else {
            toast.error("Category not found");
            router.push("/admin/categories");
          }
        } catch (error) {
          console.error("Error loading category:", error);
          toast.error("Failed to load category");
        } finally {
          setIsFetching(false);
        }
      };
      loadCategory();
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, categoryId, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    setIsLoading(true);
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug || generateCategorySlug(formData.name),
        description: formData.description,
        icon: formData.icon,
        iconEmoji: formData.iconEmoji,
        backgroundColor: formData.backgroundColor, // ✅ Fix 3
        order: formData.order,
        status: formData.status,
        featured: formData.featured,
      };

      let result;
      if (isEditMode) {
        const oldCategory = await getCategoryById(categoryId);
        result = await updateCategory(categoryId, categoryData, oldCategory.category, admin);
      } else {
        result = await createCategory(categoryData, admin);
      }

      if (result.success) {
        toast.success(`Category ${isEditMode ? "updated" : "created"} successfully!`);
        router.push("/admin/categories");
      } else {
        toast.error(result.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete category "${formData.name}"`,
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
      setIsLoading(true);
      try {
        const deleteResult = await deleteCategory(categoryId, formData.name, admin);
        if (deleteResult.success) {
          toast.success("Category deleted successfully");
          router.push("/admin/categories");
        } else {
          toast.error(deleteResult.error || "Failed to delete category");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete category");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isDarkMode
              ? "border-rose-500/60 text-rose-600 bg-rose-100 hover:bg-rose-950/40"
              : "border-rose-300 text-rose-600 bg-rose-200 hover:bg-rose-50"
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-red-500">
            {isEditMode ? "Edit Category" : "Create New Category"}
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
            {isEditMode ? "Update your category details" : "Add a new category for News, Blogs, or Videos"}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isDark={isDarkMode}
          />
        </div>
        <div>
          <CategorySidebar
            formData={formData}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            isLoading={isLoading}
            isEditMode={isEditMode}
            isDark={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}