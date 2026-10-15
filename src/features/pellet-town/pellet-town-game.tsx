"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Gamepad2,
  Keyboard,
  Rocket,
  TerminalSquare,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { createPelletTownEngine } from "./engine";
import { TERMINAL_SNIPPETS, type TerminalSnippet } from "./content";
import { VirtualJoystick } from "./virtual-joystick";

interface CommandLine {
  type: "input" | "output";
  text: string;
}

export function PelletTownGame() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof createPelletTownEngine> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joystickState, setJoystickState] = useState({ x: 0, y: 0, active: false });
  const [shardProgress, setShardProgress] = useState({ collected: 0, total: 0 });
  const [activeTerminal, setActiveTerminal] = useState<TerminalSnippet | null>(null);
  const [terminalProgress, setTerminalProgress] = useState({ visited: 0, total: TERMINAL_SNIPPETS.length });
  const [portalUnlocked, setPortalUnlocked] = useState(false);
  const [showMissionBrief, setShowMissionBrief] = useState(true);
  const [rewardToken, setRewardToken] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);
  const [mobileFullscreen, setMobileFullscreen] = useState(false);
  const [terminalUnlocked, setTerminalUnlocked] = useState(false);
  const [showCommandTerminal, setShowCommandTerminal] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [commandLines, setCommandLines] = useState<CommandLine[]>([]);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const commandScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = new Audio(
      "/games/pellet-town/Pokemon%20Ruby%20Sapphire%20Emerald-%20Littleroot%20Town.mp3",
    );
    audio.loop = true;
    audio.volume = 0.34;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("pellet-town-reward-token");
    if (saved) {
      setRewardToken(saved);
    }
  }, []);

  useEffect(() => {
    const updateViewportState = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobileViewport(isMobile);
      setIsAndroidDevice(/Android/i.test(window.navigator.userAgent));

      if (!isMobile) {
        setMobileFullscreen(false);
      }
    };

    updateViewportState();
    window.addEventListener("resize", updateViewportState);

    return () => {
      window.removeEventListener("resize", updateViewportState);
    };
  }, []);

  useEffect(() => {
    if (isMobileViewport) {
      setMobileFullscreen(true);
    }
  }, [isMobileViewport]);

  useEffect(() => {
    if (!portalUnlocked) {
      return;
    }

    if (rewardToken) {
      return;
    }

    const token = `LAB-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    setRewardToken(token);
    window.localStorage.setItem("pellet-town-reward-token", token);
  }, [portalUnlocked, rewardToken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    engineRef.current = createPelletTownEngine(canvas, {
      onReady: () => {
        setLoading(false);
      },
      onError: (message) => {
        setError(message);
        setLoading(false);
      },
      onShardUpdate: (collected, total) => {
        setShardProgress({ collected, total });
      },
      onTerminalTrigger: (snippet, visited, total) => {
        setTerminalProgress({ visited, total });
        setActiveTerminal(snippet);
      },
      onPortalStateChange: (isUnlocked) => {
        setPortalUnlocked(isUnlocked);
      },
      onPortalEnter: () => {
        router.push("/contact");
      },
    });

    engineRef.current.start();

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [router]);

  useEffect(() => {
    engineRef.current?.setJoystick(joystickState);
  }, [joystickState]);

  useEffect(() => {
    if (terminalUnlocked) {
      return;
    }

    if (shardProgress.total === 0) {
      return;
    }

    if (shardProgress.collected !== shardProgress.total) {
      return;
    }

    setTerminalUnlocked(true);
    setShowCommandTerminal(true);
    setCommandLines([
      { type: "output", text: "XP Core synced. Dev terminal unlocked." },
      { type: "output", text: "Type `help` to view available commands." },
    ]);
  }, [terminalUnlocked, shardProgress.collected, shardProgress.total]);

  useEffect(() => {
    if (showCommandTerminal) {
      commandInputRef.current?.focus();
    }
  }, [showCommandTerminal]);

  useEffect(() => {
    const node = commandScrollRef.current;
    if (!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
  }, [commandLines]);

  const handleCopyToken = async () => {
    if (!rewardToken) {
      return;
    }

    try {
      await navigator.clipboard.writeText(rewardToken);
    } catch {
      // ignore clipboard failures
    }
  };

  const handlePriorityContact = () => {
    if (!rewardToken) {
      router.push("/contact?source=secret-lab");
      return;
    }

    router.push(`/contact?source=secret-lab&token=${encodeURIComponent(rewardToken)}`);
  };

  const startMusicFromUserGesture = async () => {
    const audio = audioRef.current;
    if (!audio || !musicOn) {
      return;
    }

    try {
      await audio.play();
    } catch {
      // ignored: browser may still block based on user settings
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }

    setMusicOn(true);
    try {
      await audio.play();
    } catch {
      // ignored
    }
  };

  const handleInteractAction = () => {
    engineRef.current?.requestInteract();
  };

  const handleSecondaryAction = () => {
    if (activeTerminal) {
      setActiveTerminal(null);
      return;
    }

    if (showCommandTerminal) {
      setShowCommandTerminal(false);
      return;
    }

    if (showMissionBrief) {
      setShowMissionBrief(false);
      void startMusicFromUserGesture();
    }
  };

  const setDigitalDirection = (direction: "up" | "down" | "left" | "right" | null) => {
    if (!direction) {
      const reset = { x: 0, y: 0, active: false };
      setJoystickState(reset);
      engineRef.current?.setJoystick(reset);
      return;
    }

    const nextState =
      direction === "up"
        ? { x: 0, y: -1, active: true }
        : direction === "down"
          ? { x: 0, y: 1, active: true }
          : direction === "left"
            ? { x: -1, y: 0, active: true }
            : { x: 1, y: 0, active: true };

    setJoystickState(nextState);
    engineRef.current?.setJoystick(nextState);
  };

  const handleCloseMobileView = () => {
    if (isAndroidDevice) {
      router.push("/");
      return;
    }

    setMobileFullscreen(false);
  };

  const isAndroidGbaMode = isMobileViewport && mobileFullscreen && isAndroidDevice;
  const isImmersiveMobileGameplay = isMobileViewport && mobileFullscreen;

  useEffect(() => {
    const immersiveMobileGameplay = isMobileViewport && mobileFullscreen;

    if (!immersiveMobileGameplay) {
      document.body.classList.remove("pellet-town-immersive");
      document.documentElement.classList.remove("pellet-town-immersive");
      return;
    }

    document.body.classList.add("pellet-town-immersive");
    document.documentElement.classList.add("pellet-town-immersive");

    return () => {
      document.body.classList.remove("pellet-town-immersive");
      document.documentElement.classList.remove("pellet-town-immersive");
    };
  }, [isMobileViewport, mobileFullscreen]);

  const appendCommandOutput = (lines: string[]) => {
    setCommandLines((previous) => [
      ...previous,
      ...lines.map((line) => ({ type: "output" as const, text: line })),
    ]);
  };

  const runTerminalCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) {
      return;
    }

    setCommandLines((previous) => [...previous, { type: "input", text: `> ${command}` }]);

    if (command === "help") {
      appendCommandOutput([
        "Available: help, about, stack, hire, clear",
        "Tip: use `hire` to jump to contact route.",
      ]);
      return;
    }

    if (command === "about") {
      appendCommandOutput([
        "Bedanta: full-stack builder focused on product + systems thinking.",
        "This game is a hidden portfolio layer built on canvas + Next.js.",
      ]);
      return;
    }

    if (command === "stack") {
      appendCommandOutput([
        "Core stack:",
        "- Next.js + TypeScript",
        "- React + Tailwind",
        "- Node.js + Express",
        "- MongoDB + Prisma",
      ]);
      return;
    }

    if (command === "hire") {
      appendCommandOutput(["Opening priority contact route..."]);
      router.push("/contact?source=secret-terminal");
      return;
    }

    if (command === "clear") {
      setCommandLines([{ type: "output", text: "Terminal cleared. Type `help`." }]);
      return;
    }

    appendCommandOutput([`Unknown command: ${command}`, "Type `help` for command list."]);
  };

  return (
    <section className={isImmersiveMobileGameplay ? "fixed inset-0 z-[120] bg-black" : "w-full"}>
      <div
        className={`relative overflow-hidden ${
          isImmersiveMobileGameplay
            ? "h-full w-full rounded-none border-0 bg-black p-0"
            : "rounded-2xl border border-stone-700/70 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.15),rgba(24,24,27,0.2)_40%,rgba(9,9,11,0.85)_85%)] p-4 sm:p-5"
        }`}
      >
        {!isImmersiveMobileGameplay && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Secret Lab</p>
            <h2 className="mb-0 mt-1 text-xl sm:text-2xl">Pellet Town</h2>
          </div>
          <button
            type="button"
            onClick={toggleMusic}
            className="inline-flex items-center gap-2 rounded-md border border-stone-700 bg-stone-900/40 px-3 py-2 text-xs text-zinc-300 hover:bg-stone-800/60"
          >
            {musicOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {musicOn ? "Music On" : "Music Off"}
          </button>
          </div>
        )}

        {!isImmersiveMobileGameplay && (
          <div className="mb-3 grid gap-2 text-xs sm:grid-cols-2">
            <div className="rounded-lg border border-amber-300/20 bg-amber-100/10 px-3 py-2 text-amber-100">
              XP Shards: {shardProgress.collected}/{shardProgress.total || "?"}
            </div>
            <div className="rounded-lg border border-sky-300/20 bg-sky-100/10 px-3 py-2 text-sky-100">
              Terminals: {terminalProgress.visited}/{terminalProgress.total || "?"}
            </div>
          </div>
        )}

        {!isImmersiveMobileGameplay && !mobileFullscreen && isMobileViewport && (
          <div className="mb-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileFullscreen(true)}
              className="w-full rounded-md border border-zinc-600 bg-zinc-900/70 px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-200"
            >
              Open Fullscreen GBA Mode
            </button>
          </div>
        )}

        <div
          className={`relative w-full overflow-hidden ${
            mobileFullscreen && isMobileViewport
              ? "h-full flex flex-col rounded-none border-0 bg-black"
              : "aspect-[16/9] rounded-xl border border-stone-700/80 bg-zinc-950"
          }`}
        >
            {mobileFullscreen && isMobileViewport && (
              <div className="z-20 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2">
                <span />
                <button
                  type="button"
                  aria-label="Close handheld mode"
                  onClick={handleCloseMobileView}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {isImmersiveMobileGameplay && (
              <div className="z-20 grid grid-cols-2 gap-2 px-4 pb-2 pt-2">
                <div className="rounded-md border border-amber-300/25 bg-zinc-900/90 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-amber-100">
                  Shards {shardProgress.collected}/{shardProgress.total || "?"}
                </div>
                <div className="rounded-md border border-sky-300/25 bg-zinc-900/90 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-sky-100">
                  Terminals {terminalProgress.visited}/{terminalProgress.total || "?"}
                </div>
              </div>
            )}

            <div
              className={`relative overflow-hidden ${
                isImmersiveMobileGameplay
                  ? "mx-auto aspect-[16/9] w-[96vw] max-w-[640px] border border-zinc-700 bg-zinc-950"
                  : "h-full w-full"
              }`}
            >
              <canvas ref={canvasRef} className="h-full w-full" />

              {loading && (
                <div className="absolute inset-0 grid place-items-center bg-zinc-950/75 backdrop-blur-sm">
                  <p className="animate-pulse text-sm uppercase tracking-[0.24em] text-zinc-300">Booting map...</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 grid place-items-center bg-zinc-950/85 p-4 text-center">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </div>

            {isAndroidGbaMode && (
              <div className="relative z-10 mt-3 flex flex-1 flex-col px-4 pb-5">
                <div className="mb-4 flex items-center justify-between px-2">
                  <button className="h-9 min-w-24 rounded-md border border-zinc-500/80 bg-gradient-to-b from-zinc-700 to-zinc-800 text-sm font-semibold text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    L
                  </button>
                  <button className="h-9 min-w-24 rounded-md border border-zinc-500/80 bg-gradient-to-b from-zinc-700 to-zinc-800 text-sm font-semibold text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    R
                  </button>
                </div>

                <div className="grid flex-1 grid-cols-[1fr_1fr] items-end gap-6">
                  <div className="justify-self-start pb-2">
                    <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
                      <div />
                      <button
                        type="button"
                        className="h-14 w-14 rounded-md border border-zinc-500/90 bg-gradient-to-b from-zinc-700 to-zinc-800 text-lg text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-[1px]"
                        style={{ touchAction: "none" }}
                        onPointerDown={(event) => {
                          event.preventDefault();
                          setDigitalDirection("up");
                        }}
                        onPointerUp={() => setDigitalDirection(null)}
                        onPointerCancel={() => setDigitalDirection(null)}
                        onPointerLeave={() => setDigitalDirection(null)}
                        onPointerOut={() => setDigitalDirection(null)}
                      >
                        ▲
                      </button>
                      <div />
                      <button
                        type="button"
                        className="h-14 w-14 rounded-md border border-zinc-500/90 bg-gradient-to-b from-zinc-700 to-zinc-800 text-lg text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-[1px]"
                        style={{ touchAction: "none" }}
                        onPointerDown={(event) => {
                          event.preventDefault();
                          setDigitalDirection("left");
                        }}
                        onPointerUp={() => setDigitalDirection(null)}
                        onPointerCancel={() => setDigitalDirection(null)}
                        onPointerLeave={() => setDigitalDirection(null)}
                        onPointerOut={() => setDigitalDirection(null)}
                      >
                        ◀
                      </button>
                      <div className="h-14 w-14 rounded-md border border-zinc-600/80 bg-zinc-900/90" />
                      <button
                        type="button"
                        className="h-14 w-14 rounded-md border border-zinc-500/90 bg-gradient-to-b from-zinc-700 to-zinc-800 text-lg text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-[1px]"
                        style={{ touchAction: "none" }}
                        onPointerDown={(event) => {
                          event.preventDefault();
                          setDigitalDirection("right");
                        }}
                        onPointerUp={() => setDigitalDirection(null)}
                        onPointerCancel={() => setDigitalDirection(null)}
                        onPointerLeave={() => setDigitalDirection(null)}
                        onPointerOut={() => setDigitalDirection(null)}
                      >
                        ▶
                      </button>
                      <div />
                      <button
                        type="button"
                        className="h-14 w-14 rounded-md border border-zinc-500/90 bg-gradient-to-b from-zinc-700 to-zinc-800 text-lg text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-[1px]"
                        style={{ touchAction: "none" }}
                        onPointerDown={(event) => {
                          event.preventDefault();
                          setDigitalDirection("down");
                        }}
                        onPointerUp={() => setDigitalDirection(null)}
                        onPointerCancel={() => setDigitalDirection(null)}
                        onPointerLeave={() => setDigitalDirection(null)}
                        onPointerOut={() => setDigitalDirection(null)}
                      >
                        ▼
                      </button>
                      <div />
                    </div>
                  </div>

                  <div className="justify-self-end pb-2 pr-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-3">
                      <div />
                      <button
                        type="button"
                        onClick={handleInteractAction}
                        className="h-20 w-20 rounded-full border border-cyan-300/60 bg-gradient-to-b from-cyan-700/40 to-zinc-800 text-3xl font-semibold text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(34,211,238,0.2)] active:translate-y-[1px]"
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={handleSecondaryAction}
                        className="h-20 w-20 rounded-full border border-zinc-400/80 bg-gradient-to-b from-zinc-700 to-zinc-800 text-3xl font-semibold text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] active:translate-y-[1px]"
                      >
                        B
                      </button>
                      <div />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4">
                  <button className="h-8 min-w-24 rounded-md border border-zinc-500/80 bg-gradient-to-b from-zinc-700 to-zinc-800 text-xs font-semibold tracking-widest text-zinc-300">
                    SELECT
                  </button>
                  <button className="h-8 min-w-24 rounded-md border border-zinc-500/80 bg-gradient-to-b from-zinc-700 to-zinc-800 text-xs font-semibold tracking-widest text-zinc-300">
                    START
                  </button>
                </div>
              </div>
            )}

            {!isAndroidGbaMode && mobileFullscreen && isMobileViewport && (
              <div className="relative z-10 mt-5 flex flex-1 items-end justify-between px-4 pb-5">
                <VirtualJoystick
                  containerClassName="relative"
                  onMove={(state) => {
                    setJoystickState(state);
                    engineRef.current?.setJoystick(state);
                  }}
                />

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleSecondaryAction}
                    className="h-14 w-14 rounded-full border border-zinc-300/50 bg-gradient-to-b from-zinc-700/80 to-zinc-900/90 text-sm font-semibold text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] active:translate-y-[1px]"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={handleInteractAction}
                    className="h-16 w-16 rounded-full border border-cyan-300/60 bg-gradient-to-b from-cyan-700/45 to-zinc-900/90 text-base font-semibold text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(34,211,238,0.22)] active:translate-y-[1px]"
                  >
                    A
                  </button>
                </div>
              </div>
            )}
        </div>

        {!isImmersiveMobileGameplay && (
          <div className="mt-4 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-lg border border-stone-700/70 bg-stone-900/30 px-3 py-2">
              <Keyboard size={14} className="text-zinc-200" />
              Desktop: use <span className="text-zinc-100">W A S D</span> to move.
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-stone-700/70 bg-stone-900/30 px-3 py-2">
              <Gamepad2 size={14} className="text-zinc-200" />
              Mobile: drag the joystick to explore.
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-stone-700/70 bg-stone-900/30 px-3 py-2 sm:col-span-2">
              <TerminalSquare size={14} className="text-zinc-200" />
              Collect shards and visit terminals. Then use the portal.
            </div>
          </div>
        )}
      </div>

      {showMissionBrief && !loading && !error && !isImmersiveMobileGameplay && (
        <div className="fixed inset-0 z-[220] grid place-items-center bg-zinc-950/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-amber-300/25 bg-zinc-900/95 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Mission Brief</p>
            <h3 className="mb-0 mt-2 text-2xl sm:text-3xl">Quick Instructions</h3>
            <p className="mt-3 text-sm text-zinc-300 sm:text-base">
              Collect all shards, open all terminals, then enter the portal.
            </p>

            <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-lg border border-amber-300/20 bg-amber-100/10 px-3 py-2 text-amber-100">
                Yellow diamonds: collect all
              </div>
              <div className="rounded-lg border border-sky-300/20 bg-sky-100/10 px-3 py-2 text-sky-100">
                Cyan boxes: open all
              </div>
              <div className="rounded-lg border border-emerald-300/20 bg-emerald-100/10 px-3 py-2 text-emerald-100 sm:col-span-2">
                Green portal: enter after objectives
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300">
              Controls: Desktop <span className="text-zinc-100">W A S D</span> | Mobile <span className="text-zinc-100">drag joystick</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowMissionBrief(false);
                  void startMusicFromUserGesture();
                }}
                className="rounded-md border border-amber-300/30 bg-amber-200/10 px-4 py-2 text-sm text-amber-100 hover:bg-amber-200/20"
              >
                Start Hunt
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMissionBrief(false);
                  void startMusicFromUserGesture();
                }}
                className="rounded-md border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              >
                Skip Intro
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTerminal && (
        <div className="fixed inset-0 z-[220] grid place-items-center bg-zinc-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-xl border border-sky-400/25 bg-zinc-900/95 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Project Description</p>
            <h3 className="mb-2 mt-2 text-xl">{activeTerminal.title}</h3>
            <p className="mb-2 text-xs text-zinc-400">{activeTerminal.stack}</p>
            <p className="text-sm text-zinc-300">{activeTerminal.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={activeTerminal.href}
                className="rounded-md border border-sky-300/30 bg-sky-200/10 px-3 py-2 text-xs text-sky-100 no-underline hover:bg-sky-200/20"
              >
                View Build
              </Link>
              <button
                type="button"
                className="rounded-md border border-zinc-600 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800"
                onClick={() => setActiveTerminal(null)}
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {terminalUnlocked && !isImmersiveMobileGameplay && (
        <div className="mt-4 rounded-xl border border-cyan-300/25 bg-cyan-100/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">XP Reward Unlocked</p>
          <h4 className="mb-0 mt-1 text-base sm:text-lg">Interactive Dev Terminal</h4>
          <p className="mt-1 text-sm text-cyan-50/90">
            Run commands to inspect profile context or jump to a hiring route.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowCommandTerminal(true)}
              className="inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-200/10 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-200/20"
            >
              <TerminalSquare size={14} />
              Open Terminal
            </button>
          </div>
        </div>
      )}

      {portalUnlocked && rewardToken && !isImmersiveMobileGameplay && (
        <div className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-100/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Completion Reward</p>
          <h4 className="mb-0 mt-1 text-base sm:text-lg">Secret Lab Access Key</h4>
          <p className="mt-1 text-sm text-emerald-50/90">
            You cleared every objective. Use this key for your priority contact route.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-900/30 px-3 py-2">
            <Trophy size={14} className="text-emerald-300" />
            <span className="font-mono text-xs text-emerald-100">{rewardToken}</span>
            <button
              type="button"
              onClick={handleCopyToken}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-emerald-300/30 px-2 py-1 text-xs text-emerald-100 hover:bg-emerald-200/10"
            >
              <Copy size={12} />
              Copy
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePriorityContact}
              className="inline-flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-200/10 px-3 py-2 text-xs text-emerald-100 hover:bg-emerald-200/20"
            >
              <Rocket size={14} />
              Priority Contact Route
            </button>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-600 px-3 py-2 text-xs text-zinc-200 no-underline hover:bg-zinc-800"
            >
              View Featured Builds
            </Link>
          </div>
        </div>
      )}

      {showCommandTerminal && terminalUnlocked && (
        <div className="fixed inset-0 z-[220] grid place-items-center bg-zinc-950/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-cyan-400/30 bg-zinc-900/95 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Secret Dev Terminal</p>
              <button
                type="button"
                className="rounded-md border border-zinc-600 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
                onClick={() => setShowCommandTerminal(false)}
              >
                Close
              </button>
            </div>

            <div
              ref={commandScrollRef}
              className="h-64 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 sm:h-72"
            >
              {commandLines.map((line, index) => (
                <p
                  key={`${line.text}-${index}`}
                  className={line.type === "input" ? "text-cyan-300" : "text-zinc-200"}
                >
                  {line.text}
                </p>
              ))}
            </div>

            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                runTerminalCommand(commandInput);
                setCommandInput("");
              }}
            >
              <input
                ref={commandInputRef}
                value={commandInput}
                onChange={(event) => setCommandInput(event.target.value)}
                placeholder="Type command: help"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-400"
              />
              <button
                type="submit"
                className="rounded-md border border-cyan-300/30 bg-cyan-200/10 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-200/20"
              >
                Run
              </button>
            </form>
          </div>
        </div>
      )}

      {!mobileFullscreen && !isAndroidDevice && (
        <VirtualJoystick
          containerClassName="fixed bottom-5 left-4 z-40 md:hidden"
          onMove={(state) => {
            setJoystickState(state);
            engineRef.current?.setJoystick(state);
          }}
        />
      )}
    </section>
  );
}
