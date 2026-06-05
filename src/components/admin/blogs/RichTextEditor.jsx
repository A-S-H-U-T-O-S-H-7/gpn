"use client";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false
});

export default function RichTextEditor({
  value,
  onChange,
  label = "Content",
  placeholder = "Write your content here...",
  minHeight = "250px",
  showLabel = true,
  error = null,
  required = false,
  isDark = false
}) {

  return (
    <div>
      {showLabel && (
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div
        className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
          isDark
            ? "border-red-500/40 hover:border-red-500"
            : "border-red-300 hover:border-red-400"
        } ${error ? "border-red-500" : ""}`}
      >
        <SunEditor
          onChange={onChange}
          setContents={value}
          defaultValue={value || ""}
          setOptions={{
            iframe: false,
            fullScreen: false,
            buttonList: [
              ["undo", "redo"],
              ["bold", "italic", "underline", "strike"],
              ["font", "fontSize", "formatBlock"],
              ["list", "align"],
              ["link", "image", "video"],
              ["removeFormat"]
            ],
            formats: {
              h1: "Heading 1",
              h2: "Heading 2",
              h3: "Heading 3",
              p: "Normal"
            },
            font: [
              "Arial",
              "Helvetica",
              "Times New Roman",
              "Georgia",
              "Impact",
              "Tahoma",
              "Verdana"
            ],
            fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36],
            minHeight: minHeight,
            height: "auto",
            placeholder: placeholder,
            width: "100%",
            buttonStyle: "soft",
            toolbarStickyTop: 0,
            attributesWhitelist: { all: "style" },
            colorList: [
              "#ef4444", // Red
              "#dc2626", // Darker Red
              "#000000", // Black
              "#333333", // Dark Gray
              "#666666", // Gray
              "#999999", // Light Gray
              "#ffffff", // White
              "#3b82f6", // Blue
              "#10b981", // Green
              "#f59e0b", // Orange
              "#8b5cf6", // Purple
              "#ec4899"  // Pink
            ],
            linkTargetNewWindow: true,
            showPathLabel: false,
            resizingBar: false,
            defaultStyle: `
              font-family: inherit;
              font-size: 14px;
              line-height: 1.6;
              background-color: ${isDark ? "#1f2937" : "#ffffff"};
              color: ${isDark ? "#f3f4f6" : "#111827"};
            `,
            katex: false
          }}
          setDefaultStyle={`
            background-color: ${isDark ? "#1f2937" : "#ffffff"};
            border-radius: 0.75rem;
            min-height: ${minHeight};
            padding: 1rem;
            color: ${isDark ? "#f3f4f6" : "#111827"};
            border: none;
          `}
        />
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}