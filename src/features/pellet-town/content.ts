export interface TerminalSnippet {
  id: string;
  title: string;
  stack: string;
  summary: string;
  href: string;
}

export const DEV_JOURNEY_QUOTE =
  "Built in hostel nights, shipped through chaos, learned by breaking things and rebuilding stronger.";

export interface ZoneTilePoint {
  id: string;
  row: number;
  col: number;
}

export interface TerminalTilePoint extends ZoneTilePoint {
  snippetId: string;
}

export const TERMINAL_SNIPPETS: TerminalSnippet[] = [
  {
    id: "rag-lab",
    title: "Incandescence 2025 Official Website",
    stack: "Next.js, TypeScript, Express.js, MongoDB, Prisma, S3",
    summary:
      "Developed a scalable game feature with photo uploads, letter collection and robust backend handling over 1.3M+ API requests.",
    href: "/projects",
  },
  {
    id: "agent-orch",
    title: "Terminal Agent",
    stack: "Python, OpenAI SDK, OpenRouter API, Function Calling, CLI",
    summary:
      "CLI coding agent that uses Read/Write/Bash tools with model tool-calling to run iterative code-edit loops.",
    href: "/projects",
  },
  {
    id: "graphql-hub",
    title: "Redis from Scratch",
    stack: "Python, TCP Sockets, RESP, Threading, Client-Server Systems",
    summary:
      "Redis-style TCP server implementation from scratch with threaded connections and protocol/command handling modules.",
    href: "/projects",
  },
];

// These tile coordinates were selected from collision-map reachable cells
// and spread across distant map regions for exploration.
export const SHARD_ZONE_TILES: ZoneTilePoint[] = [
  { id: "xp-1", row: 23, col: 17 },
  { id: "xp-2", row: 13, col: 31 },
  { id: "xp-3", row: 15, col: 40 },
  { id: "xp-4", row: 19, col: 34 },
  { id: "xp-5", row: 24, col: 52 },
  { id: "xp-6", row: 27, col: 43 },
];

export const TERMINAL_ZONE_TILES: TerminalTilePoint[] = [
  { id: "terminal-a", row: 13, col: 21, snippetId: "rag-lab" },
  { id: "terminal-b", row: 19, col: 46, snippetId: "agent-orch" },
  { id: "terminal-c", row: 26, col: 50, snippetId: "graphql-hub" },
];

export const PORTAL_ZONE = {
  id: "hire-portal",
  row: 18,
  col: 32,
  width: 46,
  height: 46,
} as const;
