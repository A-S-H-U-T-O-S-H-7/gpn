"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import NewsForm from "@/components/admin/news/NewsForm";
import NewsSidebar from "@/components/admin/news/NewsSidebar";
import { getNewsById, createNews, updateNews, generateSlug } from "@/lib/services/newsService";

export default function ManageNewsPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const params = useParams();
  const newsId = params?.id;
  const isEditMode = newsId && newsId !== "new";

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    content: "",
    category: "general",
    tags: [],
    tagsInput: "",
    metatitle: "",
    metadesc: "",
    metakeywords: "",
    status: "draft",
    manualSlug: false,
    isBreaking: false,
    isEditorPick: false,
    isTrending: false,
    featuredImage: null,
    featuredImagePreview: null,
    existingImageUrl: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const loadNews = async () => {
        try {
          const result = await getNewsById(newsId);
          if (result.success && result.news) {
            const news = result.news;
            setFormData({
              title: news.title || "",
              url: news.slug || "",
              content: news.content || "",
              category: news.category || "general",
              tags: news.tags || [],
              tagsInput: news.tags?.join(', ') || "",
              metatitle: news.metatitle || "",
              metadesc: news.metadesc || "",
              metakeywords: news.metakeywords || "",
              status: news.status || "draft",
              manualSlug: true,
              isBreaking: news.isBreaking || false,
              isEditorPick: news.isEditorPick || false,
              isTrending: news.isTrending || false,
              featuredImage: null,
              featuredImagePreview: news.image || null,
              existingImageUrl: news.image || null,
            });
          } else {
            toast.error("News not found");
            router.push("/admin/news");
          }
        } catch (error) {
          console.error("Error loading news:", error);
          toast.error("Failed to load news");
        } finally {
          setIsFetching(false);
        }
      };
      loadNews();
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, newsId, router]);

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
      const newsData = {
        title: formData.title,
        url: formData.url || generateSlug(formData.title),
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        metatitle: formData.metatitle,
        metadesc: formData.metadesc,
        metakeywords: formData.metakeywords,
        status: formData.status,
        isBreaking: formData.isBreaking,
        isEditorPick: formData.isEditorPick,
        isTrending: formData.isTrending,
      };

      let result;
      if (isEditMode) {
        const oldNews = await getNewsById(newsId);
        result = await updateNews(newsId, newsData, formData.featuredImage, formData.existingImageUrl, oldNews.news, admin);
      } else {
        result = await createNews(newsData, formData.featuredImage, admin);
      }

      if (result.success) {
        toast.success(`News ${isEditMode ? "updated" : "created"} successfully!`);
        router.push("/admin/news");
      } else {
        toast.error(result.error || "Failed to save news");
      }
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error("Failed to save news");
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
    <div className="pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isDarkMode
              ? "border-red-500/60 text-red-500 bg-red-200 hover:bg-red-950/40"
              : "border-red-300 text-red-600 bg-red-200 hover:bg-red-50"
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>
            {isEditMode ? "Edit News" : "Create New News"}
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
            {isEditMode ? "Update your news article" : "Add a new news article to your website"}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NewsForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isDark={isDarkMode}
          />
        </div>
        <div>
          <NewsSidebar
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