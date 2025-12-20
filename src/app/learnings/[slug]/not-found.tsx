import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-2xl font-semibold text-zinc-100 mb-4">Learning Not Found</h1>
      <p className="text-zinc-400 text-center mb-6">
        The learning post you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/learnings"
        className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800/80 hover:bg-stone-800/90 border border-stone-700/50 rounded-lg text-sm text-zinc-100 transition-all duration-300"
      >
        <ArrowLeft size={16} />
        <span>Back to Learnings</span>
      </Link>
    </div>
  );
}


