"use client";

export default function AILoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">AI is generating content...</p>
        <p className="text-xs text-gray-500">This may take a few seconds</p>
      </div>
    </div>
  );
}