"use client";

import { useState } from "react";
import { AlignLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function FormatDescriptionButton({ content, onFormatted, size = "sm" }) {
  const [isFormatting, setIsFormatting] = useState(false);
  
  const handleFormat = async () => {
    if (!content || content.trim().length < 10) {
      toast.error("Please add some content to format");
      return;
    }
    
    setIsFormatting(true);
    
    try {
      const response = await fetch("/api/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
          action: "format"
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.formattedDescription) {
        onFormatted("description", data.formattedDescription);
        toast.success("Description formatted successfully!");
      } else {
        toast.error("Failed to format description");
      }
    } catch (error) {
      console.error("Format error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsFormatting(false);
    }
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };
  
  return (
    <button
      type="button"
      onClick={handleFormat}
      disabled={isFormatting}
      className={`
        inline-flex items-center gap-1.5
        bg-gradient-to-r from-green-500 to-teal-500
        hover:from-green-600 hover:to-teal-600
        text-white font-medium rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
      `}
    >
      {isFormatting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Formatting...
        </>
      ) : (
        <>
          <AlignLeft className="w-3.5 h-3.5" />
          Format Description
        </>
      )}
    </button>
  );
}