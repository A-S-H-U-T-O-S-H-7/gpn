"use client";

import Link from "next/link";
import NewsThumbnail from "./NewsThumbnail";
import NewsStats from "./NewsStats";

export default function NewsCard({ news }) {
  return (
    <Link href={`/news/${news.slug}`} className="group block h-full">
      <div className="
        relative rounded-xl overflow-hidden
        bg-white dark:bg-slate-800/80
        border border-slate-200 dark:border-slate-600/70
        shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/60
        hover:-translate-y-1
        transition-all duration-300
        h-full flex flex-col
      ">
        <NewsThumbnail news={news} />

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="
            text-sm sm:text-base font-bold leading-snug
            text-slate-800 dark:text-slate-100
            group-hover:text-blue-600 dark:group-hover:text-blue-400
            line-clamp-2 min-h-[44px]
            transition-colors duration-200
          ">
            {news.title}
          </h3>

          {/* Excerpt */}
          {news.excerpt && (
            <p className="
              mt-2 text-xs text-slate-500 dark:text-slate-400
              line-clamp-2
            ">
              {news.excerpt}
            </p>
          )}

          <NewsStats news={news} />
        </div>

        {/* Bottom accent bar */}
        <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 rounded-b-xl" />
      </div>
    </Link>
  );
}