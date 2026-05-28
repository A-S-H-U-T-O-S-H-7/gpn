import EditorsPicks from "./EditorsPicks";
import MostWatched from "./MostWatched";

export default function EditorsAndWatchedGrid() {
  return (
    <section className="py-10 bg-gray-50 dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-sm">

          {/* Left — Editor's Picks */}
          <div className="p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800">
            <EditorsPicks />
          </div>

          {/* Right — Most Watched */}
          <div className="p-4 sm:p-6">
            <MostWatched />
          </div>

        </div>
      </div>
    </section>
  );
}