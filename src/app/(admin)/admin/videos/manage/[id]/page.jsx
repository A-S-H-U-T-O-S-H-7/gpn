"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import VideoForm from "@/components/admin/videos/VideoForm";
import VideoSidebar from "@/components/admin/videos/VideoSidebar";
import { getVideoById, createVideo, updateVideo, generateSlug, getYouTubeId } from "@/lib/services/videoService";

export default function ManageVideoPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const params = useParams();
  const videoId = params?.id;
  const isEditMode = videoId && videoId !== "new";

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    youtubeUrl: "",
    duration: "",
    category: "",
    tags: [],
    tagsInput: "",
    description: "",
    metatitle: "",
    metadesc: "",
    metakeywords: "",
    status: "draft",
    manualSlug: false,
    videoType: "standard",
    isFeatured: false,
    isEditorPick: false,
    isTrending: false,
    isHero: false,
  });

  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  useEffect(() => {
    const videoId_from_url = getYouTubeId(formData.youtubeUrl);
    setVideoPreview(videoId_from_url);
  }, [formData.youtubeUrl]);

  useEffect(() => {
    if (isEditMode) {
      const loadVideo = async () => {
        try {
          const result = await getVideoById(videoId);
          if (result.success && result.video) {
            const video = result.video;
            setFormData({
              title: video.title || "",
              url: video.slug || "",
              youtubeUrl: video.youtubeUrl || "",
              duration: video.duration || "",
              category: video.category || "",
              tags: video.tags || [],
              tagsInput: video.tags?.join(', ') || "",
              description: video.description || "",
              metatitle: video.metatitle || "",
              metadesc: video.metadesc || "",
              metakeywords: video.metakeywords || "",
              status: video.status || "draft",
              manualSlug: true,
              videoType: video.videoType || "standard",
              isFeatured: video.isFeatured || false,
              isEditorPick: video.isEditorPick || false,
              isTrending: video.isTrending || false,
              isHero: video.isHero || false,
            });
          } else {
            toast.error("Video not found");
            router.push("/admin/videos");
          }
        } catch (error) {
          console.error("Error loading video:", error);
          toast.error("Failed to load video");
        } finally {
          setIsFetching(false);
        }
      };
      loadVideo();
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, videoId, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.url.trim()) newErrors.url = "URL is required";
    if (!formData.youtubeUrl.trim()) newErrors.youtubeUrl = "YouTube URL is required";
    if (!getYouTubeId(formData.youtubeUrl)) newErrors.youtubeUrl = "Invalid YouTube URL";
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
      const videoData = {
        title: formData.title,
        url: formData.url || generateSlug(formData.title),
        youtubeUrl: formData.youtubeUrl,
        duration: formData.duration,
        category: formData.category,
        tags: formData.tags,
        description: formData.description,
        metatitle: formData.metatitle,
        metadesc: formData.metadesc,
        metakeywords: formData.metakeywords,
        status: formData.status,
        videoType: formData.videoType,
        isFeatured: formData.isFeatured,
        isEditorPick: formData.isEditorPick,  
        isTrending: formData.isTrending,
        isHero: formData.isHero,              
      };

      let result;
      if (isEditMode) {
        const oldVideo = await getVideoById(videoId);
        result = await updateVideo(videoId, videoData, oldVideo.video, admin);
      } else {
        result = await createVideo(videoData, admin);
      }

      if (result.success) {
        toast.success(`Video ${isEditMode ? "updated" : "created"} successfully!`);
        router.push("/admin/videos");
      } else {
        toast.error(result.error || "Failed to save video");
      }
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Failed to save video");
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
              ? "border-rose-500/60  text-rose-600 bg-rose-100 hover:bg-rose-950/40"
              : "border-rose-300 text-rose-600 bg-rose-200 hover:bg-rose-50"
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>
            {isEditMode ? "Edit Video" : "Add New Video"}
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
            {isEditMode ? "Update your video details" : "Add a new video to your website"}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isDark={isDarkMode}
          />
        </div>
        <div>
          <VideoSidebar
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isDark={isDarkMode}
            videoPreview={videoPreview}
          />
        </div>
      </div>
    </div>
  );
}