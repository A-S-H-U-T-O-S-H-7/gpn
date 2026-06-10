"use client";

import { AlertCircle, TrendingUp, Award, Bookmark } from "lucide-react";

export default function NewsBadge({ news }) {
  const getBadge = () => {
    if (news.isBreaking) {
      return {
        label: "BREAKING",
        icon: <AlertCircle className="w-2.5 h-2.5" />,
        className: "bg-gradient-to-r from-red-600 to-orange-500 animate-pulse"
      };
    }
    if (news.isTrending) {
      return {
        label: "TRENDING",
        icon: <TrendingUp className="w-2.5 h-2.5" />,
        className: "bg-gradient-to-r from-purple-600 to-pink-500"
      };
    }
    if (news.isEditorPick) {
      return {
        label: "EDITOR'S PICK",
        icon: <Award className="w-2.5 h-2.5" />,
        className: "bg-gradient-to-r from-amber-600 to-yellow-500"
      };
    }
    if (news.category) {
      return {
        label: news.category.toUpperCase(),
        icon: <Bookmark className="w-2.5 h-2.5" />,
        className: "bg-gradient-to-r from-blue-600 to-cyan-500"
      };
    }
    return null;
  };

  const badge = getBadge();
  
  if (!badge) return null;

  return (
    <div className="absolute top-3 left-3">
      <div className={`
        flex items-center gap-1.5
        px-2 py-1 rounded-md
        text-white text-[10px] font-bold
        shadow-lg uppercase tracking-wide
        ${badge.className}
      `}>
        {badge.icon}
        {badge.label}
      </div>
    </div>
  );
}