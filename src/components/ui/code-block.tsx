"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {

  // Custom theme with unique color scheme - distinct from VS Code
  // Using oneDark as base and overriding with custom colors
  const customStyle = {
    ...oneDark,
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      color: "#e8e6e3",
      textShadow: "none",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    },
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "#1a1a1a",
      border: "none",
      borderRadius: "0",
      margin: 0,
      padding: 0,
    },
    '.token.comment': {
      color: "#6b7280",
      fontStyle: "italic",
    },
    '.token.prolog': {
      color: "#6b7280",
    },
    '.token.doctype': {
      color: "#6b7280",
    },
    '.token.cdata': {
      color: "#6b7280",
    },
    '.token.string': {
      color: "#10b981",
    },
    '.token.char': {
      color: "#10b981",
    },
    '.token.attr-value': {
      color: "#10b981",
    },
    '.token.regex': {
      color: "#10b981",
    },
    '.token.keyword': {
      color: "#f59e0b",
      fontWeight: "600",
    },
    '.token.function': {
      color: "#8b5cf6",
    },
    '.token.number': {
      color: "#3b82f6",
    },
    '.token.operator': {
      color: "#ef4444",
    },
    '.token.punctuation': {
      color: "#d1d5db",
    },
    '.token.property': {
      color: "#3b82f6",
    },
    '.token.selector': {
      color: "#f59e0b",
    },
    '.token.tag': {
      color: "#22c55e",
    },
    '.token.attr-name': {
      color: "#3b82f6",
    },
    '.token.class-name': {
      color: "#8b5cf6",
    },
    '.token.boolean': {
      color: "#3b82f6",
    },
    '.token.constant': {
      color: "#3b82f6",
    },
    '.token.variable': {
      color: "#fbbf24",
    },
    '.token.namespace': {
      color: "#8b5cf6",
    },
    '.token.builtin': {
      color: "#8b5cf6",
    },
    '.token.entity': {
      color: "#f59e0b",
    },
    '.token.url': {
      color: "#10b981",
    },
    '.token.symbol': {
      color: "#3b82f6",
    },
    '.token.important': {
      color: "#ef4444",
      fontWeight: "600",
    },
    '.token.atrule': {
      color: "#8b5cf6",
    },
    '.token.parameter': {
      color: "#fbbf24",
    },
    '.token.interpolation': {
      color: "#8b5cf6",
    },
    '.token.interpolation-punctuation': {
      color: "#d1d5db",
    },
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-stone-800/90 bg-stone-900/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center px-4 py-2.5 bg-stone-800/60 border-b border-stone-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
          {language && language !== "text" && (
            <span className="text-xs font-medium text-zinc-300 font-mono ml-2">
              {language}
            </span>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={customStyle}
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.75rem",
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
            },
          }}
          PreTag="div"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

