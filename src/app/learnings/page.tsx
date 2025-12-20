"use client";
import { PageTransition } from "@/components/animation/page-transition";
import Link from "next/link";
import { learningPosts } from "./data";

export default function Learnings() {
  return (
    <PageTransition>
      {/* Header Section */}
      <section className="w-full flex flex-col justify-start px-1 mb-8">
        <h2 className="text-xl sm:text-2xl font-medium mb-2">Learnings ~</h2>
        <p className="text-sm sm:text-base text-zinc-300">
          Thoughts, tutorials and insights on web development, AI/ML and tech in general.
        </p>
      </section>

      {/* Learning Posts List */}
      <section className="w-full flex flex-col gap-6">
        {learningPosts.map((post) => (
          <Link
            key={post.id}
            href={`/learnings/${post.slug}`}
            className="group border border-stone-800 rounded-lg p-4 hover:bg-zinc-900/40 transition-colors"
          >
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1">
              {post.title}
            </h3>
            <p className="text-sm text-zinc-400">
              {new Date(post.date).toLocaleDateString("en-US", { 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
          </Link>
        ))}
      </section>

      {/* Empty State (if no posts) */}
      {learningPosts.length === 0 && (
        <section className="w-full flex flex-col items-center justify-center py-12 px-4">
          <p className="text-zinc-400 text-center">
            No learnings yet. Check back soon!
          </p>
        </section>
      )}
    </PageTransition>
  );
}

