"use client";

export default function SkeletonNewsCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
        <div className="aspect-video bg-slate-200 dark:bg-slate-700" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-4/5" />
          </div>
          <div className="flex justify-between pt-2">
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4" />
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4" />
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
}