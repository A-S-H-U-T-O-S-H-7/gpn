import EditorsPicks from "./EditorsPicks";
import MostWatched from "./MostWatched";

export default function EditorsAndWatchedGrid() {
  return (
    <section className="py-10 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Editor's Picks */}
          <EditorsPicks />
          
          {/* Right: Most Watched */}
          <MostWatched />
        </div>
      </div>
    </section>
  );
}