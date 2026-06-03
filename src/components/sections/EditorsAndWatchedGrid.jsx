import EditorsPicks from "./EditorsPicks";
import MostWatched from "./MostWatched";

export default function EditorsAndWatchedGrid() {
  return (
    <section className="py-10 bg-linear-to-br from-blue-100 to-cyan-200 dark:bg-linear-to-br dark:from-blue-600 dark:to-cyan-700 ">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-sm">

          {/* Left — Editor's Picks */}
          <div className="p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
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