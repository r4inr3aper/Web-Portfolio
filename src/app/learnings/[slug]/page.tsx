"use client";
import { PageTransition } from "@/components/animation/page-transition";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getLearningPostBySlug } from "../data";
import { use } from "react";
import { CodeBlock } from "@/components/ui/code-block";

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

  // Helper to render inline markdown (bold, italic, code)
  const renderInlineMarkdown = (text: string): JSX.Element => {
    const parts: (string | JSX.Element)[] = [];
    let currentIndex = 0;
    const textLength = text.length;

    while (currentIndex < textLength) {
      // Check for inline code (backticks)
      const codeMatch = text.substring(currentIndex).match(/^`([^`]+)`/);
      if (codeMatch) {
        parts.push(
          <code
            key={`code-${currentIndex}`}
            className="bg-zinc-800/90 text-zinc-100 px-2 py-0.5 rounded text-[0.9rem] font-mono border border-zinc-700/50"
          >
            {codeMatch[1]}
          </code>
        );
        currentIndex += codeMatch[0].length;
        continue;
      }

      // Check for bold (**text**)
      const boldMatch = text.substring(currentIndex).match(/^\*\*([^*]+)\*\*/);
      if (boldMatch) {
        parts.push(
          <strong key={`bold-${currentIndex}`} className="font-bold text-zinc-50 font-sans">
            {renderInlineMarkdown(boldMatch[1])}
          </strong>
        );
        currentIndex += boldMatch[0].length;
        continue;
      }

      // Check for highlight/mark (==text==)
      const highlightMatch = text.substring(currentIndex).match(/^==([^=]+)==/);
      if (highlightMatch) {
        parts.push(
          <mark key={`highlight-${currentIndex}`} className="text-[hsla(32,98%,83%,.9)] font-thin rounded bg-transparent">
            {renderInlineMarkdown(highlightMatch[1])}
          </mark>
        );
        currentIndex += highlightMatch[0].length;
        continue;
      }

      // Check for italic (*text* or _text_)
      const italicMatch = text.substring(currentIndex).match(/^(\*|_)([^*_]+)\1/);
      if (italicMatch) {
        parts.push(
          <em key={`italic-${currentIndex}`} className="italic text-zinc-200">
            {renderInlineMarkdown(italicMatch[2])}
          </em>
        );
        currentIndex += italicMatch[0].length;
        continue;
      }

      // Check for markdown links [text](url)
      const linkMatch = text.substring(currentIndex).match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={`link-${currentIndex}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400/90 hover:text-amber-300 underline decoration-amber-400/90 hover:decoration-amber-300 transition-colors"
          >
            {renderInlineMarkdown(linkMatch[1])}
          </a>
        );
        currentIndex += linkMatch[0].length;
        continue;
      }

      // Check for plain URLs (http://, https://, www.)
      const urlMatch = text.substring(currentIndex).match(/^https?:\/\/[^\s]+|^www\.[^\s]+/);
      if (urlMatch) {
        const url = urlMatch[0].startsWith("www.") ? `https://${urlMatch[0]}` : urlMatch[0];
        parts.push(
          <a
            key={`url-${currentIndex}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400/90 hover:text-amber-300 underline decoration-amber-400/90 hover:decoration-amber-300 transition-colors"
          >
            {urlMatch[0]}
          </a>
        );
        currentIndex += urlMatch[0].length;
        continue;
      }

      // Regular text - find the next special character
      let nextSpecial = textLength;
      const codeIndex = text.indexOf("`", currentIndex);
      const boldIndex = text.indexOf("**", currentIndex);
      const highlightIndex = text.indexOf("==", currentIndex);
      const linkStartIndex = text.indexOf("[", currentIndex);
      const urlStartIndex = Math.min(
        text.indexOf("http://", currentIndex) !== -1 ? text.indexOf("http://", currentIndex) : textLength,
        text.indexOf("https://", currentIndex) !== -1 ? text.indexOf("https://", currentIndex) : textLength,
        text.indexOf("www.", currentIndex) !== -1 ? text.indexOf("www.", currentIndex) : textLength
      );
      const italicIndex = Math.min(
        text.indexOf("*", currentIndex) !== -1 ? text.indexOf("*", currentIndex) : textLength,
        text.indexOf("_", currentIndex) !== -1 ? text.indexOf("_", currentIndex) : textLength
      );

      if (codeIndex !== -1 && codeIndex < nextSpecial) nextSpecial = codeIndex;
      if (boldIndex !== -1 && boldIndex < nextSpecial) nextSpecial = boldIndex;
      if (highlightIndex !== -1 && highlightIndex < nextSpecial) nextSpecial = highlightIndex;
      if (linkStartIndex !== -1 && linkStartIndex < nextSpecial) nextSpecial = linkStartIndex;
      if (urlStartIndex !== -1 && urlStartIndex < nextSpecial) nextSpecial = urlStartIndex;
      if (italicIndex !== -1 && italicIndex < nextSpecial) nextSpecial = italicIndex;

      if (nextSpecial > currentIndex) {
        parts.push(text.substring(currentIndex, nextSpecial));
        currentIndex = nextSpecial;
      } else {
        parts.push(text.substring(currentIndex));
        break;
      }
    }

    return <>{parts}</>;
  };

  // Format content - simple markdown-like rendering
  const formatContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let codeBlock: string[] = [];
    let codeLanguage = "";
    let inCodeBlock = false;
    let listItems: string[] = [];
    let inList = false;
    let blockquoteItems: string[] = [];
    let inBlockquote = false;
    let noteItems: string[] = [];
    let inNote = false;
    let isFirstHeading = true; // Track first heading to skip it (it's the title)

    lines.forEach((line, index) => {
      // Code block detection
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End code block
          const codeContent = codeBlock.join("\n");
          const lang = codeLanguage || "text";
          
          elements.push(
            <CodeBlock
              key={`code-block-${index}`}
              code={codeContent}
              language={lang}
            />
          );
          codeBlock = [];
          codeLanguage = "";
          inCodeBlock = false;
        } else {
          // Start code block - extract language if present
          if (inBlockquote) {
            elements.push(
              <blockquote key={`blockquote-${index}`} className="border-l-4 border-zinc-600 pl-4 my-4 italic text-sm sm:text-base">
                {blockquoteItems.map((item, i) => (
                  <p key={i} className="mb-1 last:mb-0">{renderInlineMarkdown(item)}</p>
                ))}
              </blockquote>
            );
            blockquoteItems = [];
            inBlockquote = false;
          }
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-4 text-sm sm:text-base">
                {renderInlineMarkdown(currentParagraph.join(" "))}
              </p>
            );
            currentParagraph = [];
          }
          codeLanguage = line.substring(3).trim() || "";
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
        // Skip the first H1 as it's already shown as the page title
        if (isFirstHeading) {
          isFirstHeading = false;
          return;
        }
        if (inBlockquote) {
          elements.push(
            <blockquote key={`blockquote-${index}`} className="border-l-4 border-zinc-600 pl-4 my-4 italic text-sm sm:text-base">
              {blockquoteItems.map((item, i) => (
                <p key={i} className="mb-1 last:mb-0">{renderInlineMarkdown(item)}</p>
              ))}
            </blockquote>
          );
          blockquoteItems = [];
          inBlockquote = false;
        }
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-sm sm:text-base">
              {renderInlineMarkdown(currentParagraph.join(" "))}
            </p>
          );
          currentParagraph = [];
        }
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-outside space-y-1 mb-4 ml-6 text-sm sm:text-base">
              {listItems.map((item, i) => (
                <li key={i} className="pl-2">{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl sm:text-2xl font-medium mt-6 mb-4">
            {renderInlineMarkdown(line.substring(2))}
          </h2>
        );
        return;
      }

      if (line.startsWith("## ")) {
        if (inBlockquote) {
          elements.push(
            <blockquote key={`blockquote-${index}`} className="border-l-4 border-zinc-600 pl-4 my-4 italic text-sm sm:text-base">
              {blockquoteItems.map((item, i) => (
                <p key={i} className="mb-1 last:mb-0">{renderInlineMarkdown(item)}</p>
              ))}
            </blockquote>
          );
          blockquoteItems = [];
          inBlockquote = false;
        }
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-sm sm:text-base">
              {renderInlineMarkdown(currentParagraph.join(" "))}
            </p>
          );
          currentParagraph = [];
        }
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-outside space-y-1 mb-4 ml-6 text-sm sm:text-base">
              {listItems.map((item, i) => (
                <li key={i} className="pl-2">{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg sm:text-xl font-medium mt-5 mb-4">
            {renderInlineMarkdown(line.substring(3))}
          </h3>
        );
        return;
      }

      if (line.startsWith("### ")) {
        if (inBlockquote) {
          elements.push(
            <blockquote key={`blockquote-${index}`} className="border-l-4 border-zinc-600 pl-4 my-4 italic text-sm sm:text-base">
              {blockquoteItems.map((item, i) => (
                <p key={i} className="mb-1 last:mb-0">{renderInlineMarkdown(item)}</p>
              ))}
            </blockquote>
          );
          blockquoteItems = [];
          inBlockquote = false;
        }
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-sm sm:text-base">
              {renderInlineMarkdown(currentParagraph.join(" "))}
            </p>
          );
          currentParagraph = [];
        }
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-outside space-y-1 mb-4 ml-6 text-sm sm:text-base">
              {listItems.map((item, i) => (
                <li key={i} className="pl-2">{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        elements.push(
          <h4 key={`h4-${index}`} className="text-base sm:text-lg font-medium mt-4 mb-4">
            {renderInlineMarkdown(line.substring(4))}
          </h4>
        );
        return;
      }

      // NOTE block (special styled note)
      if (line.trim().toUpperCase().startsWith("> NOTE:") || (inNote && line.startsWith("> "))) {
        if (!inNote) {
          inNote = true;
          // Close any open blocks
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-4 text-sm sm:text-base">
                {renderInlineMarkdown(currentParagraph.join(" "))}
              </p>
            );
            currentParagraph = [];
          }
          if (inList) {
            elements.push(
              <ul key={`ul-${index}`} className="list-disc list-outside space-y-1 mb-4 ml-6 text-sm sm:text-base">
                {listItems.map((item, i) => (
                  <li key={i} className="pl-2">{renderInlineMarkdown(item)}</li>
                ))}
              </ul>
            );
            listItems = [];
            inList = false;
          }
          if (inBlockquote) {
            elements.push(
              <blockquote key={`blockquote-${index}`} className="border-l-4 border-zinc-600 pl-4 my-4 italic text-sm sm:text-base">
                {blockquoteItems.map((item, i) => (
                  <p key={i} className="mb-1 last:mb-0">{renderInlineMarkdown(item)}</p>
                ))}
              </blockquote>
            );
            blockquoteItems = [];
            inBlockquote = false;
          }
        }
        noteItems.push(line.substring(2));
        return;
      } else if (inNote && line.trim() === "") {
        // Close note on empty line
        elements.push(
          <div key={`note-${index}`} className="border-l border-zinc-600/60 pl-4 my-4 italic text-sm sm:text-base text-zinc-300/90">
            <p className="mb-0">{renderInlineMarkdown(noteItems.join(" "))}</p>
          </div>
        );
        noteItems = [];
        inNote = false;
      } else if (inNote && !line.startsWith("> ")) {
        // Close note if line doesn't start with >
        elements.push(
          <div key={`note-${index}`} className="border-l border-zinc-600/60 pl-4 my-4 italic text-sm sm:text-base text-zinc-300/90">
            <p className="mb-0">{renderInlineMarkdown(noteItems.join(" "))}</p>
          </div>
        );
        noteItems = [];
        inNote = false;
      }

      // Blockquote (regular blockquotes, not notes)
      if (line.startsWith("> ") && !inNote) {
        if (!inBlockquote) {
          inBlockquote = true;
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-4 text-sm sm:text-base">
                {renderInlineMarkdown(currentParagraph.join(" "))}
              </p>
            );
            currentParagraph = [];
          }
          if (inList) {
            elements.push(
              <ul key={`ul-${index}`} className="list-disc list-outside space-y-1 mb-4 ml-6 text-sm sm:text-base">
                {listItems.map((item, i) => (
                  <li key={i} className="pl-2">{renderInlineMarkdown(item)}</li>
                ))}
              </ul>
            );
            listItems = [];
            inList = false;
          }
        }
        blockquoteItems.push(line.substring(2));
        return;
      } else if (inBlockquote && line.trim() === "") {
        elements.push(
          <blockquote key={`blockquote-${index}`} className="border-l-4 border-zinc-600 pl-4 my-4 italic text-sm sm:text-base">
            {blockquoteItems.map((item, i) => (
              <p key={i} className="mb-1 last:mb-0">{renderInlineMarkdown(item)}</p>
            ))}
          </blockquote>
        );
        blockquoteItems = [];
        inBlockquote = false;
      } else if (inBlockquote && !line.startsWith("> ")) {
        // Close blockquote if line doesn't start with >
        elements.push(
          <blockquote key={`blockquote-${index}`} className="border-l-4 border-zinc-600 pl-4 my-4 italic text-sm sm:text-base">
            {blockquoteItems.map((item, i) => (
              <p key={i} className="mb-1 last:mb-0">{renderInlineMarkdown(item)}</p>
            ))}
          </blockquote>
        );
        blockquoteItems = [];
        inBlockquote = false;
      }

      // Skip processing if we're still in blockquote or note
      if (inBlockquote || inNote) {
        return;
      }

      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inList) {
          inList = true;
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-4 text-sm sm:text-base">
                {renderInlineMarkdown(currentParagraph.join(" "))}
              </p>
            );
            currentParagraph = [];
          }
        }
        listItems.push(line.substring(2));
        return;
      } else if (inList) {
        elements.push(
            <ul key={`ul-${index}`} className="list-disc list-outside space-y-1 mb-4 ml-6 text-sm sm:text-base">
            {listItems.map((item, i) => (
              <li key={i} className="pl-2">{renderInlineMarkdown(item)}</li>
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
          <p key={`p-${index}`} className="mb-4 text-sm sm:text-base">
            {renderInlineMarkdown(currentParagraph.join(" "))}
          </p>
        );
        currentParagraph = [];
      }
    });

    // Handle remaining content
    if (noteItems.length > 0) {
      elements.push(
        <div key="note-final" className="border-l border-zinc-600/60 pl-4 my-4 italic text-sm sm:text-base text-zinc-300/90">
          <p className="mb-0">{renderInlineMarkdown(noteItems.join(" "))}</p>
        </div>
      );
    }

    if (blockquoteItems.length > 0) {
      elements.push(
        <blockquote key="blockquote-final" className="border-l-4 border-zinc-600 pl-4 my-4 italic text-sm sm:text-base">
          {blockquoteItems.map((item, i) => (
            <p key={i} className="mb-1 last:mb-0">{renderInlineMarkdown(item)}</p>
          ))}
        </blockquote>
      );
    }

    if (currentParagraph.length > 0) {
      elements.push(
          <p key="p-final" className="mb-4 text-sm sm:text-base">
          {renderInlineMarkdown(currentParagraph.join(" "))}
        </p>
      );
    }

    if (listItems.length > 0) {
      elements.push(
        <ul key="ul-final" className="list-disc list-outside space-y-1 mb-4 ml-6 text-sm sm:text-base">
          {listItems.map((item, i) => (
            <li key={i} className="pl-2">{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <PageTransition>
      {/* Header Section */}
      <section className="w-full flex flex-col justify-start p-[0.4rem]">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-medium mb-4">
          {post.title}
        </h1>

        {/* Date */}
        <p className="text-sm sm:text-base text-zinc-400 mb-4">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </section>

      {/* Content Section */}
      <section className="w-full flex flex-col justify-start p-[0.4rem]">
        <article className="w-full max-w-none">
          {formatContent(post.content)}
        </article>
      </section>
    </PageTransition>
  );
}


