"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import BlogForm from "@/components/admin/blogs/BlogForm";
import BlogSidebar from "@/components/admin/blogs/BlogSidebar";
import { getBlogById, createBlog, updateBlog, generateSlug } from "@/lib/services/blogService";

export default function ManageBlogPage() {
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id;
  const isEditMode = blogId && blogId !== "new";

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    content: "",
    metatitle: "",
    metadesc: "",
    metakeywords: "",
    status: "draft",
    manualSlug: false,
    featuredImage: null,
    featuredImagePreview: null,
    existingImageUrl: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const loadBlog = async () => {
        try {
          const result = await getBlogById(blogId);
          if (result.success && result.blog) {
            const blog = result.blog;
            setFormData({
              title: blog.title || "",
              url: blog.url || "",
              content: blog.content || "",
              metatitle: blog.metatitle || "",
              metadesc: blog.metadesc || "",
              metakeywords: blog.metakeywords || "",
              status: blog.status || "draft",
              manualSlug: true,
              featuredImage: null,
              featuredImagePreview: blog.image || null,
              existingImageUrl: blog.image || null,
            });
          } else {
            toast.error("Blog not found");
            router.push("/admin/blogs");
          }
        } catch (error) {
          console.error("Error loading blog:", error);
          toast.error("Failed to load blog");
        } finally {
          setIsFetching(false);
        }
      };
      loadBlog();
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, blogId, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.url.trim()) newErrors.url = "URL is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.metatitle.trim()) newErrors.metatitle = "Meta title is required";
    if (!formData.metadesc.trim()) newErrors.metadesc = "Meta description is required";
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
      const blogData = {
        title: formData.title,
        url: formData.url || generateSlug(formData.title),
        content: formData.content,
        metatitle: formData.metatitle,
        metadesc: formData.metadesc,
        metakeywords: formData.metakeywords,
        status: formData.status,
      };

      let result;
      if (isEditMode) {
        result = await updateBlog(blogId, blogData, formData.featuredImage, formData.existingImageUrl);
      } else {
        result = await createBlog(blogData, formData.featuredImage);
      }

      if (result.success) {
        toast.success(`Blog ${isEditMode ? "updated" : "created"} successfully!`);
        router.push("/admin/blogs");
      } else {
        toast.error(result.error || "Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog");
    } finally {
      setIsLoading(false);
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
    <div className="pt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
            isDarkMode
              ? "border-rose-500/60  text-rose-600 bg-rose-100 hover:bg-rose-950/40"
              : "border-rose-300 text-rose-600 bg-rose-200 hover:bg-rose-50"
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-50' : 'text-gray-950'}`}>
            {isEditMode ? "Edit Blog" : "Create New Blog"}
          </h1>
          <p className={`text-gray-600 ${isDarkMode ? 'dark:text-gray-300' : 'text-gray-500'} mt-1`}>
            {isEditMode ? "Update your blog post" : "Add a new blog post to your website"}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BlogForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isDark={isDarkMode}
          />
        </div>
        <div>
          <BlogSidebar
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isDark={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}