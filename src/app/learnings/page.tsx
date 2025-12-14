"use client";
import { PageTransition } from "@/components/animation/page-transition";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { learningPosts } from "./data";

export default function Learnings() {
  return (
    <PageTransition>
      {/* Header Section */}
      <section className="w-full flex flex-col justify-start px-1 mb-6">
        <h2 className="text-xl sm:text-2xl font-medium">Learnings ~</h2>
        <p className="text-sm sm:text-base text-zinc-300 mt-2">
          Thoughts, tutorials and insights on web development, AI/ML and tech in general.
        </p>
      </section>

      {/* Learning Posts Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPosts.map((post) => (
          <Link
            key={post.id}
            href={`/learnings/${post.slug}`}
            className="group border border-stone-800/90 rounded-lg overflow-hidden flex flex-col bg-stone-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-stone-900/50 hover:bg-stone-900/40"
          >
            <div className="p-6 flex flex-col gap-3 flex-grow">
              {/* Category Badge */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-stone-800/70 text-xs rounded-md text-amber-400 border border-amber-500/30">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-zinc-50 transition-colors">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-zinc-300 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex items-center gap-4 text-xs text-zinc-400 mt-auto pt-2 border-t border-stone-800/50">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-zinc-500" />
                  <span>{new Date(post.date).toLocaleDateString("en-US", { 
                    year: "numeric", 
                    month: "short", 
                    day: "numeric" 
                  })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-zinc-500" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Read More */}
              <div className="flex items-center gap-1 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors mt-2">
                <span>Read more</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
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

