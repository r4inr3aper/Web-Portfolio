"use client";

import { useRef, useState } from "react";

interface JoystickState {
  x: number;
  y: number;
  active: boolean;
}

interface VirtualJoystickProps {
  onMove: (state: JoystickState) => void;
  containerClassName?: string;
}

const JOYSTICK_SIZE = 118;
const JOYSTICK_RADIUS = JOYSTICK_SIZE / 2;
const THUMB_SIZE = 48;

export function VirtualJoystick({ onMove, containerClassName }: VirtualJoystickProps) {
  const [thumb, setThumb] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) {
      return;
    }

    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    const maxDistance = JOYSTICK_RADIUS - THUMB_SIZE / 2;
    const clampedDistance = Math.min(distance, maxDistance);
    const angle = Math.atan2(deltaY, deltaX);

    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;

    setThumb({ x, y });

    onMove({
      x: x / maxDistance,
      y: y / maxDistance,
      active: true,
    });
  };

  const reset = () => {
    setActive(false);
    setThumb({ x: 0, y: 0 });
    onMove({ x: 0, y: 0, active: false });
  };

  return (
    <div className={containerClassName ?? "fixed bottom-5 left-4 z-40 md:hidden"} aria-hidden={false}>
      <div
        ref={baseRef}
        className={`relative rounded-full border backdrop-blur-sm transition-all duration-150 ${
          active
            ? "scale-[1.03] border-zinc-300/60 bg-zinc-900/90 shadow-[0_0_0_2px_rgba(255,255,255,0.08)]"
            : "border-zinc-500/50 bg-zinc-900/65"
        }`}
        style={{ width: JOYSTICK_SIZE, height: JOYSTICK_SIZE, touchAction: "none" }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setActive(true);
          updatePosition(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (!active) {
            return;
          }

          updatePosition(event.clientX, event.clientY);
        }}
        onPointerUp={reset}
        onPointerCancel={reset}
      >
        <div className="pointer-events-none absolute inset-2 rounded-full border border-zinc-300/20" />
        <div className="pointer-events-none absolute inset-5 rounded-full border border-zinc-200/30" />
        <div className="pointer-events-none absolute left-1/2 top-3 h-[calc(100%-24px)] w-px -translate-x-1/2 bg-zinc-200/20" />
        <div className="pointer-events-none absolute left-3 top-1/2 h-px w-[calc(100%-24px)] -translate-y-1/2 bg-zinc-200/20" />
        <div
          className="absolute rounded-full border border-zinc-200/70 bg-zinc-200/20 shadow-[0_0_20px_rgba(255,255,255,0.16)]"
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            left: `calc(50% - ${THUMB_SIZE / 2}px + ${thumb.x}px)`,
            top: `calc(50% - ${THUMB_SIZE / 2}px + ${thumb.y}px)`,
          }}
        />
      </div>
      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-zinc-400">D-Pad</p>
    </div>
  );
}
