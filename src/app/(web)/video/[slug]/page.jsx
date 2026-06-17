"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaCopy,
  FaCheck,
  FaLink,
} from "react-icons/fa";
import {
  FiArrowLeft,
  FiCalendar,
  FiEye,
  FiClock,
  FiShare2,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getVideoBySlug, incrementVideoView } from "@/lib/services/videoService";

// ============================================================================
// HELPERS
// ============================================================================
function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatViews(views) {
  if (!views) return "0";
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K";
  return String(views);
}

// ============================================================================
// SHARE DRAWER COMPONENT
// ============================================================================
function ShareDrawer({ url, title, open, onClose }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const share = (platform) => {
    const encUrl = encodeURIComponent(url);
    const encTitle = encodeURIComponent(title);
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encTitle}%20${encUrl}`,
    };
    window.open(
      shareUrls[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
    onClose();
  };

  if (!open) return null;

  const socials = [
    {
      id: "facebook",
      label: "Facebook",
      bg: "bg-[#1877F2] hover:bg-[#1666D9]",
      icon: <FaFacebook size={18} />,
    },
    {
      id: "twitter",
      label: "Twitter",
      bg: "bg-[#1DA1F2] hover:bg-[#1A8CD8]",
      icon: <FaTwitter size={18} />,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      bg: "bg-[#0A66C2] hover:bg-[#0958A9]",
      icon: <FaLinkedin size={18} />,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      bg: "bg-[#25D366] hover:bg-[#20BA5C]",
      icon: <FaWhatsapp size={18} />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        ref={ref}
        className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <p className="font-bold text-slate-800 dark:text-white text-sm">
            Share this video
          </p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-5 grid grid-cols-4 gap-3">
          {socials.map((s) => (
            <button
              key={s.id}
              onClick={() => share(s.id)}
              className={`${s.bg} text-white rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all hover:scale-105`}
            >
              {s.icon}
              <span className="text-[9px] font-semibold">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5">
            <FaLink className="text-slate-400 flex-shrink-0" size={14} />
            <span className="flex-1 text-xs text-slate-500 dark:text-slate-400 truncate">
              {url}
            </span>
            <button
              onClick={copyLink}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
            >
              {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================
function LoadingState() {
  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-950 flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-3 h-3 rounded-full bg-red animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function VideoDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchVideo = async () => {
      setLoading(true);
      try {
        const result = await getVideoBySlug(slug);

        if (result.success && result.video) {
          setVideo(result.video);
          setLikeCount(result.video.likes || 0);

          const savedSet = JSON.parse(
            localStorage.getItem("gpn_saved_videos") || "[]"
          );
          const likedSet = JSON.parse(
            localStorage.getItem("gpn_liked_videos") || "[]"
          );
          setIsSaved(savedSet.includes(result.video.id));
          setIsLiked(likedSet.includes(result.video.id));

          const key = `video_viewed_${result.video.id}`;
          if (!sessionStorage.getItem(key) && result.video.id) {
            await incrementVideoView(result.video.id);
            sessionStorage.setItem(key, "true");
            setVideo((prev) =>
              prev ? { ...prev, views: (prev.views || 0) + 1 } : prev
            );
          }
        } else {
          toast.error("Video not found");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [slug, router]);

  const toggleLike = () => {
    if (!video) return;
    const likedSet = JSON.parse(localStorage.getItem("gpn_liked_videos") || "[]");
    const next = isLiked
      ? likedSet.filter((id) => id !== video.id)
      : [...likedSet, video.id];
    localStorage.setItem("gpn_liked_videos", JSON.stringify(next));
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    if (!isLiked) toast.success("Added to liked videos");
  };

  const toggleSave = () => {
    if (!video) return;
    const savedSet = JSON.parse(localStorage.getItem("gpn_saved_videos") || "[]");
    const next = isSaved
      ? savedSet.filter((id) => id !== video.id)
      : [...savedSet, video.id];
    localStorage.setItem("gpn_saved_videos", JSON.stringify(next));
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Video saved!");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (loading) return <LoadingState />;
  if (!video) return null;

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <ShareDrawer
        url={pageUrl}
        title={video.title}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <div className="min-h-screen bg-ghee dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Back Button */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-red hover:border-red-300 dark:hover:border-red-700 transition-all shadow-sm"
            >
              <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          {/* Main Layout - 2 Column */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* LEFT COLUMN - Video Player (Sticky) */}
            <div className="w-full lg:w-1/2 xl:w-5/12">
              <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl lg:sticky lg:top-8">
                <div className="aspect-video">
                  {video.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-6xl">
                      🎬
                    </div>
                  )}
                </div>

                

                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-4 right-4">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-md">
                      {video.duration}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - Content */}
            <div className="w-full lg:w-1/2 xl:w-7/12">
              {/* Category Breadcrumb */}
              <div className="flex items-center gap-2 mb-3 text-sm">
                <span className="text-red font-semibold uppercase tracking-wide text-xs">
                  {video.category || "Video"}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {formatDate(video.publishedAt || video.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
                {video.title}
              </h1>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <FiCalendar size={14} className="text-red" />
                  <span>{formatDate(video.publishedAt || video.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <FiEye size={14} className="text-red" />
                  <span>{formatViews(video.views)} views</span>
                </div>
                {video.duration && (
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                    <FiClock size={14} className="text-red" />
                    <span>{video.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <FaRegHeart size={13} className="text-red" />
                  <span>{formatViews(likeCount)} likes</span>
                </div>
              </div>

              {/* Description - USING video-content CLASS to override backgrounds */}
              {video.description && (
                <div
                  className="video-content text-slate-700 dark:text-slate-300 text-xl leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: video.description }}
                />
              )}

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                <div className="w-2 h-2 rounded-full bg-red" />
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={toggleLike}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                    isLiked
                      ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-300 hover:text-red"
                  }`}
                >
                  {isLiked ? (
                    <FaHeart size={14} className="text-red" />
                  ) : (
                    <FaRegHeart size={14} />
                  )}
                  {isLiked ? "Liked" : "Like"}
                  {likeCount > 0 && (
                    <span className="text-xs font-bold opacity-70">
                      {formatViews(likeCount)}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShareOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  <FiShare2 size={14} />
                  Share
                </button>

                <button
                  onClick={toggleSave}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                    isSaved
                      ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 hover:text-amber-600"
                  }`}
                >
                  {isSaved ? (
                    <FaBookmark size={13} className="text-amber-500" />
                  ) : (
                    <FaRegBookmark size={13} />
                  )}
                  {isSaved ? "Saved" : "Save"}
                </button>

                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 transition-all"
                >
                  {copied ? (
                    <FaCheck size={13} className="text-green-500" />
                  ) : (
                    <FaCopy size={13} />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Share Section */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Enjoyed this video? Share with your network.
              </p>
              <div className="flex items-center gap-3">
                {[
                  {
                    label: "Facebook",
                    color: "bg-[#1877F2] hover:bg-[#1666D9]",
                    icon: <FaFacebook size={16} />,
                    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      pageUrl
                    )}`,
                  },
                  {
                    label: "Twitter",
                    color: "bg-[#1DA1F2] hover:bg-[#1A8CD8]",
                    icon: <FaTwitter size={16} />,
                    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      pageUrl
                    )}&text=${encodeURIComponent(video.title)}`,
                  },
                  {
                    label: "LinkedIn",
                    color: "bg-[#0A66C2] hover:bg-[#0958A9]",
                    icon: <FaLinkedin size={16} />,
                    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      pageUrl
                    )}`,
                  },
                  {
                    label: "WhatsApp",
                    color: "bg-[#25D366] hover:bg-[#20BA5C]",
                    icon: <FaWhatsapp size={16} />,
                    url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      video.title
                    )}%20${encodeURIComponent(pageUrl)}`,
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${social.color} transition-all hover:scale-105 shadow-sm`}
                  >
                    {social.icon}
                  </a>
                ))}
                <button
                  onClick={() => setShareOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red hover:bg-red-600 text-white transition-all shadow-md shadow-red-500/25"
                >
                  <FiShare2 size={14} />
                  Share Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}