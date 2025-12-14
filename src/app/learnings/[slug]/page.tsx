"use client";
import { PageTransition } from "@/components/animation/page-transition";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getLearningPostBySlug, learningPosts } from "../data";
import { use } from "react";

interface LearningPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function LearningPostPage({ params }: LearningPostPageProps) {
  const { slug } = use(params);
  const post = getLearningPostBySlug(slug);

  if (!post) {
    return (
      <PageTransition>
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
      </PageTransition>
    );
  }

  // Format content - simple markdown-like rendering
  const formatContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let codeBlock: string[] = [];
    let inCodeBlock = false;
    let listItems: string[] = [];
    let inList = false;

    lines.forEach((line, index) => {
      // Code block detection
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre
              key={`code-${index}`}
              className="bg-stone-900/50 border border-stone-800 rounded-lg p-4 overflow-x-auto my-4"
            >
              <code className="text-sm text-zinc-300 font-mono">
                {codeBlock.join("\n")}
              </code>
            </pre>
          );
          codeBlock = [];
          inCodeBlock = false;
        } else {
          // Start code block
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-4 text-zinc-300 leading-relaxed">
                {currentParagraph.join(" ")}
              </p>
            );
            currentParagraph = [];
          }
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlock.push(line);
        return;
      }

      // Headings
      if (line.startsWith("# ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-zinc-300 leading-relaxed">
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-semibold text-zinc-100 mt-8 mb-4">
            {line.substring(2)}
          </h2>
        );
        return;
      }

      if (line.startsWith("## ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-zinc-300 leading-relaxed">
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-zinc-100 mt-6 mb-3">
            {line.substring(3)}
          </h3>
        );
        return;
      }

      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inList) {
          inList = true;
        }
        listItems.push(line.substring(2));
        return;
      } else if (inList) {
        elements.push(
          <ul key={`ul-${index}`} className="list-disc list-inside space-y-2 mb-4 text-zinc-300 ml-4">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }

      // Regular paragraph
      if (line.trim()) {
        currentParagraph.push(line.trim());
      } else if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${index}`} className="mb-4 text-zinc-300 leading-relaxed">
            {currentParagraph.join(" ")}
          </p>
        );
        currentParagraph = [];
      }
    });

    // Handle remaining content
    if (currentParagraph.length > 0) {
      elements.push(
        <p key="p-final" className="mb-4 text-zinc-300 leading-relaxed">
          {currentParagraph.join(" ")}
        </p>
      );
    }

    if (listItems.length > 0) {
      elements.push(
        <ul key="ul-final" className="list-disc list-inside space-y-2 mb-4 text-zinc-300 ml-4">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <PageTransition>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/learnings"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Learnings</span>
        </Link>
      </div>

      {/* Header Section */}
      <section className="w-full flex flex-col justify-start px-1 mb-6">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="px-2.5 py-1 bg-stone-800/70 text-xs rounded-md text-amber-400 border border-amber-500/30">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 mb-4">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-zinc-500" />
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-zinc-500" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <article className="w-full prose prose-invert max-w-none">
        <div className="border border-stone-800/90 rounded-lg p-6 sm:p-8 bg-stone-900/30">
          <div className="text-base sm:text-lg text-zinc-200 leading-relaxed">
            {formatContent(post.content)}
          </div>
        </div>
      </article>

      {/* Navigation to other posts */}
      {learningPosts.filter((p) => p.id !== post.id).length > 0 && (
        <section className="w-full mt-12 pt-8 border-t border-stone-800/50">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">More Learnings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learningPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/learnings/${relatedPost.slug}`}
                  className="group border border-stone-800/90 rounded-lg p-4 bg-stone-900/30 hover:bg-stone-900/40 transition-all duration-300"
                >
                  <h4 className="text-base font-semibold text-zinc-100 group-hover:text-zinc-50 transition-colors mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      )}
    </PageTransition>
  );
}

