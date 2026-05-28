"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp,
  FaHeart, FaRegHeart, FaBookmark, FaRegBookmark,
  FaShare, FaCopy, FaCheck, FaLink,
} from "react-icons/fa";
import {
  FiArrowLeft, FiCalendar, FiEye, FiClock,
  FiShare2, FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getVideoBySlug, incrementVideoView } from "@/lib/services/videoService";

/* ─── Helpers ──────────────────────────────────────────────────── */
function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function formatViews(v) {
  if (!v) return "0";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + "K";
  return String(v);
}

/* ─── Share Drawer ─────────────────────────────────────────────── */
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
    const enc = encodeURIComponent(url);
    const encT = encodeURIComponent(title);
    const map = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      twitter:  `https://twitter.com/intent/tweet?url=${enc}&text=${encT}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encT}%20${enc}`,
    };
    window.open(map[platform], "_blank", "noopener,noreferrer,width=600,height=500");
    onClose();
  };

  if (!open) return null;

  const socials = [
    { id: "facebook", label: "Facebook", bg: "bg-blue-600 hover:bg-blue-700", icon: <FaFacebook size={18} /> },
    { id: "twitter",  label: "Twitter/X", bg: "bg-slate-900 hover:bg-slate-700", icon: <FaTwitter size={18} /> },
    { id: "linkedin", label: "LinkedIn",  bg: "bg-sky-700 hover:bg-sky-600",   icon: <FaLinkedin size={18} /> },
    { id: "whatsapp", label: "WhatsApp",  bg: "bg-green-500 hover:bg-green-600", icon: <FaWhatsapp size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        ref={ref}
        className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
      >
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <p className="font-bold text-slate-800 dark:text-white text-sm">Share this video</p>
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
              className={`${s.bg} text-white rounded-xl p-3 flex flex-col items-center gap-1.5 transition-colors`}
            >
              {s.icon}
              <span className="text-[9px] font-semibold">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5">
            <FaLink className="text-slate-400 flex-shrink-0" size={14} />
            <span className="flex-1 text-xs text-slate-500 dark:text-slate-400 truncate">{url}</span>
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

/* ─── Loading ──────────────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="w-3 h-3 rounded-full bg-red-500 animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Stat Pill ────────────────────────────────────────────────── */
function StatPill({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
      <span className="text-red-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────── */
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
    (async () => {
      setLoading(true);
      try {
        const result = await getVideoBySlug(slug);
        if (result.success && result.video) {
          setVideo(result.video);
          setLikeCount(result.video.likes || 0);

          const savedSet = JSON.parse(localStorage.getItem("gpn_saved_videos") || "[]");
          const likedSet = JSON.parse(localStorage.getItem("gpn_liked_videos") || "[]");
          setIsSaved(savedSet.includes(result.video.id));
          setIsLiked(likedSet.includes(result.video.id));

          const key = `video_viewed_${result.video.id}`;
          if (!sessionStorage.getItem(key) && result.video.id) {
            await incrementVideoView(result.video.id);
            sessionStorage.setItem(key, "true");
            setVideo((p) => ({ ...p, views: (p?.views || 0) + 1 }));
          }
        } else {
          toast.error("Video not found");
          router.push("/");
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, router]);

  const toggleLike = () => {
    if (!video) return;
    const likedSet = JSON.parse(localStorage.getItem("gpn_liked_videos") || "[]");
    const next = isLiked
      ? likedSet.filter((id) => id !== video.id)
      : [...likedSet, video.id];
    localStorage.setItem("gpn_liked_videos", JSON.stringify(next));
    setIsLiked(!isLiked);
    setLikeCount((c) => (isLiked ? c - 1 : c + 1));
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
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 0.25s ease forwards; }
      `}</style>

      <ShareDrawer
        url={pageUrl}
        title={video.title}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">

          {/* ── Breadcrumb / Back ── */}
          <div className="flex items-center gap-2 mb-8 text-sm text-slate-400 dark:text-slate-500">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <FiChevronRight size={14} />
            <span className="text-red-500 font-semibold uppercase tracking-wide text-xs">
              {video.category || "Video"}
            </span>
          </div>

          {/* ══ MAIN CONTENT: Video Thumbnail Left | Everything Else Right ══════════════════════════════════ */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
            
            {/* LEFT COLUMN - Video Player/Thumbnail (Sticky) */}
           <div className="w-full lg:w-2/5 xl:w-5/12">
  <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl shadow-slate-300/50 dark:shadow-black/50 h-[300px] md:h-[380px] lg:h-[420px] lg:sticky lg:top-8 group bg-black">
    {video.videoId ? (
      <iframe
        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0&controls=1&rel=0&modestbranding=1`}
        title={video.title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-6xl">
        🎬
      </div>
    )}
    {/* Category ribbon */}
    <div className="absolute top-4 left-4">
      <span className="inline-block px-3 py-1 bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-lg">
        {video.category || "Video"}
      </span>
    </div>
    {/* Duration Badge */}
    {video.duration && (
      <div className="absolute bottom-4 right-4">
        <span className="inline-block px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-md">
          {video.duration}
        </span>
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
  </div>
</div>

            {/* RIGHT COLUMN - Title, Meta, Description, Actions */}
            <div className="w-full lg:w-3/5 xl:w-7/12">
              <div className="flex flex-col gap-6">
                
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-[2.6rem] font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                  {video.title}
                </h1>

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                  <StatPill icon={<FiCalendar size={14} />} label={formatDate(video.publishedAt || video.createdAt)} />
                  <span className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
                  <StatPill icon={<FiEye size={14} />} label={`${formatViews(video.views)} views`} />
                  {video.duration && (
                    <>
                      <span className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
                      <StatPill icon={<FiClock size={14} />} label={video.duration} />
                    </>
                  )}
                  <span className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
                  <StatPill icon={<FaRegHeart size={13} />} label={`${formatViews(likeCount)} likes`} />
                </div>

                {/* Description */}
                {video.description && (
                  <div 
                    className="prose prose-base max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:text-sm prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: video.description }}
                  />
                )}

                 {/* Divider before article content */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-2">
                  <button
                    onClick={toggleLike}
                    className={[
                      "flex items-center gap-2 px-2 md:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border",
                      isLiked
                        ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-300 hover:text-red-600 dark:hover:text-red-400",
                    ].join(" ")}
                  >
                    {isLiked ? <FaHeart className="text-red-500" size={14} /> : <FaRegHeart size={14} />}
                    {isLiked ? "Liked" : "Like"}
                    {likeCount > 0 && <span className="text-xs font-bold opacity-70">{formatViews(likeCount)}</span>}
                  </button>

                  <button
                    onClick={() => setShareOpen(true)}
                    className="flex items-center gap-2 px-2 md:px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                  >
                    <FiShare2 size={14} />
                    Share
                  </button>

                  <button
                    onClick={toggleSave}
                    className={[
                      "flex items-center gap-2 px-2 md:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border",
                      isSaved
                        ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 hover:text-amber-600 dark:hover:text-amber-400",
                    ].join(" ")}
                  >
                    {isSaved ? <FaBookmark className="text-amber-500" size={13} /> : <FaRegBookmark size={13} />}
                    {isSaved ? "Saved" : "Save"}
                  </button>

                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-2 md:px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 transition-all duration-200"
                  >
                    {copied ? <FaCheck size={13} className="text-green-500" /> : <FaCopy size={13} />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom share bar ── */}
          <div className="max-w-4xl mx-auto mt-14 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Enjoyed this video? Share with your network.
              </p>
              <div className="flex items-center gap-3">
                {[
                  {
                    label: "Facebook",
                    color: "bg-blue-600 hover:bg-blue-700",
                    icon: <FaFacebook size={16} />,
                    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
                  },
                  {
                    label: "Twitter/X",
                    color: "bg-slate-900 hover:bg-slate-700",
                    icon: <FaTwitter size={16} />,
                    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(video.title)}`,
                  },
                  {
                    label: "LinkedIn",
                    color: "bg-sky-700 hover:bg-sky-600",
                    icon: <FaLinkedin size={16} />,
                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
                  },
                  {
                    label: "WhatsApp",
                    color: "bg-green-500 hover:bg-green-600",
                    icon: <FaWhatsapp size={16} />,
                    href: `https://api.whatsapp.com/send?text=${encodeURIComponent(video.title)}%20${encodeURIComponent(pageUrl)}`,
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${s.color} transition-colors shadow-sm`}
                  >
                    {s.icon}
                  </a>
                ))}

                <button
                  onClick={() => setShareOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors shadow-md shadow-red-500/20"
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