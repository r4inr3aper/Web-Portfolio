import {
  DEV_JOURNEY_QUOTE,
  PORTAL_ZONE,
  SHARD_ZONE_TILES,
  TERMINAL_SNIPPETS,
  TERMINAL_ZONE_TILES,
  type TerminalSnippet,
} from "./content";

type InputDirection = "w" | "a" | "s" | "d";
type SpriteDirection = "up" | "left" | "right" | "down";

interface SpriteConfig {
  position: { x: number; y: number };
  image: HTMLImageElement;
  frames?: { max: number };
  sprites?: Partial<Record<SpriteDirection, HTMLImageElement>>;
}

interface JoystickState {
  x: number;
  y: number;
  active: boolean;
}

interface EngineOptions {
  onReady?: () => void;
  onError?: (message: string) => void;
  onShardUpdate?: (collected: number, total: number) => void;
  onQuoteUnlocked?: (quote: string) => void;
  onTerminalTrigger?: (snippet: TerminalSnippet, visited: number, total: number) => void;
  onPortalStateChange?: (unlocked: boolean) => void;
  onPortalEnter?: () => void;
}

interface Zone {
  id: string;
  type: "shard" | "terminal" | "portal";
  x: number;
  y: number;
  width: number;
  height: number;
  collected?: boolean;
  visited?: boolean;
  snippetId?: string;
}

const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 576;
const MAP_COLS = 70;
const TILE_SIZE = 48;
const BASE_SPEED = 4;
const JOYSTICK_DEADZONE = 0.2;
const INTERACTION_COOLDOWN_MS = 900;

const MAP_OFFSET = { x: -740, y: -650 };

class Sprite {
  position: { x: number; y: number };
  image: HTMLImageElement;
  frames: { max: number; val: number; elapsed: number };
  width: number;
  height: number;
  moving: boolean;
  sprites?: Partial<Record<SpriteDirection, HTMLImageElement>>;

  constructor({ position, image, frames = { max: 1 }, sprites }: SpriteConfig) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.width = this.image.width / this.frames.max || TILE_SIZE;
    this.height = this.image.height || TILE_SIZE;
    this.moving = false;
    this.sprites = sprites;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height,
    );

    if (!this.moving || this.frames.max <= 1) {
      return;
    }

    this.frames.elapsed += 1;
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val += 1;
      } else {
        this.frames.val = 0;
      }
    }
  }
}

class Boundary {
  static width = TILE_SIZE;
  static height = TILE_SIZE;

  position: { x: number; y: number };
  width: number;
  height: number;

  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(255,0,0,0)";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

function rectCollision({
  rect1,
  rect2,
}: {
  rect1: { position: { x: number; y: number }; width: number; height: number };
  rect2: { position: { x: number; y: number }; width: number; height: number };
}) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + rect2.height
  );
}

function zoneCollision(player: Sprite, zone: Zone) {
  return rectCollision({
    rect1: player,
    rect2: {
      position: { x: zone.x, y: zone.y },
      width: zone.width,
      height: zone.height,
    },
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

function collisionMapFromData(flat: number[]) {
  const map: number[][] = [];

  for (let i = 0; i < flat.length; i += MAP_COLS) {
    map.push(flat.slice(i, i + MAP_COLS));
  }

  return map;
}

function tileToWorldTopLeft(row: number, col: number, width: number, height: number) {
  const centerX = col * TILE_SIZE + MAP_OFFSET.x + TILE_SIZE / 2;
  const centerY = row * TILE_SIZE + MAP_OFFSET.y + TILE_SIZE / 2;

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
  };
}

function drawShardEffect(
  ctx: CanvasRenderingContext2D,
  zone: Zone,
  nowMs: number,
  shardImage?: HTMLImageElement | null,
) {
  const cx = zone.x + zone.width / 2;
  const cy = zone.y + zone.height / 2;
  const t = nowMs / 1000;
  const pulse = 0.65 + (Math.sin(t * 4 + cx * 0.01) + 1) * 0.25;

  const glowRadius = 20 + pulse * 12;
  const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, glowRadius);
  glow.addColorStop(0, `rgba(250, 204, 21, ${0.42 * pulse})`);
  glow.addColorStop(1, "rgba(250, 204, 21, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  if (shardImage) {
    const bob = Math.sin(t * 3 + cx * 0.01) * 2;
    const drawW = zone.width;
    const drawH = zone.height;
    ctx.drawImage(shardImage, cx - drawW / 2, cy - drawH / 2 + bob, drawW, drawH);
  } else {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 1.8);
    ctx.fillStyle = "rgba(251, 191, 36, 0.98)";
    ctx.beginPath();
    ctx.moveTo(0, -zone.height / 2);
    ctx.lineTo(zone.width / 2, 0);
    ctx.lineTo(0, zone.height / 2);
    ctx.lineTo(-zone.width / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.strokeStyle = `rgba(253, 224, 71, ${0.65 * pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 18 + pulse * 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = `rgba(254, 240, 138, ${0.42 * pulse})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 68);
  ctx.lineTo(cx, cy - 22);
  ctx.stroke();
}

function drawTerminalEffect(ctx: CanvasRenderingContext2D, zone: Zone, nowMs: number, visited: boolean) {
  const cx = zone.x + zone.width / 2;
  const cy = zone.y + zone.height / 2;
  const t = nowMs / 1000;
  const pulse = 0.6 + (Math.sin(t * 3 + cy * 0.01) + 1) * 0.2;
  const baseColor = visited ? "74, 222, 128" : "96, 165, 250";

  const glowRadius = 24 + pulse * 16;
  const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, glowRadius);
  glow.addColorStop(0, `rgba(${baseColor}, ${0.26 * pulse})`);
  glow.addColorStop(1, `rgba(${baseColor}, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(${baseColor}, 0.95)`;
  ctx.lineWidth = 3;
  ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-t * 1.4);
  ctx.strokeStyle = `rgba(${baseColor}, ${0.8 * pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-12, -12);
  ctx.lineTo(12, -12);
  ctx.lineTo(12, 12);
  ctx.lineTo(-12, 12);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = visited ? "rgba(110, 231, 183, 0.95)" : "rgba(125, 211, 252, 0.95)";
  ctx.font = "600 11px sans-serif";
  ctx.fillText("TERM", zone.x - 2, zone.y - 8);
}

function drawPortalEffect(ctx: CanvasRenderingContext2D, zone: Zone, nowMs: number) {
  const cx = zone.x + zone.width / 2;
  const cy = zone.y + zone.height / 2;
  const t = nowMs / 1000;
  const pulse = 0.6 + (Math.sin(t * 5) + 1) * 0.2;

  const glowRadius = zone.width * 0.95;
  const glow = ctx.createRadialGradient(cx, cy, 3, cx, cy, glowRadius);
  glow.addColorStop(0, `rgba(74, 222, 128, ${0.34 * pulse})`);
  glow.addColorStop(1, "rgba(74, 222, 128, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(74, 222, 128, ${0.95 * pulse})`;
  ctx.lineWidth = 4;
  ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

  ctx.strokeStyle = `rgba(134, 239, 172, ${0.6 * pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, zone.width * 0.6 + Math.sin(t * 4) * 5, 0, Math.PI * 2);
  ctx.stroke();
}

export function createPelletTownEngine(canvas: HTMLCanvasElement, options: EngineOptions = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not available.");
  }

  let rafId = 0;
  let destroyed = false;
  let running = false;

  const keyboard = {
    w: false,
    a: false,
    s: false,
    d: false,
    lastKey: "s" as InputDirection,
  };

  let joystick: JoystickState = { x: 0, y: 0, active: false };
  let interactRequested = false;

  const offset = MAP_OFFSET;

  const boundaries: Boundary[] = [];
  const zones: Zone[] = [
    ...SHARD_ZONE_TILES.map((point) => {
      const zoneSize = 22;
      const position = tileToWorldTopLeft(point.row, point.col, zoneSize, zoneSize);

      return {
        id: point.id,
        type: "shard" as const,
        x: position.x,
        y: position.y,
        width: zoneSize,
        height: zoneSize,
        collected: false,
      };
    }),
    ...TERMINAL_ZONE_TILES.map((terminal) => {
      const zoneSize = 34;
      const position = tileToWorldTopLeft(terminal.row, terminal.col, zoneSize, zoneSize);

      return {
        id: terminal.id,
        type: "terminal" as const,
        x: position.x,
        y: position.y,
        width: zoneSize,
        height: zoneSize,
        visited: false,
        snippetId: terminal.snippetId,
      };
    }),
    (() => {
      const position = tileToWorldTopLeft(PORTAL_ZONE.row, PORTAL_ZONE.col, PORTAL_ZONE.width, PORTAL_ZONE.height);

      return {
        id: PORTAL_ZONE.id,
        type: "portal" as const,
        x: position.x,
        y: position.y,
        width: PORTAL_ZONE.width,
        height: PORTAL_ZONE.height,
        visited: false,
      };
    })(),
  ];
  const interactionCooldown = new Map<string, number>();
  let quoteUnlocked = false;
  let portalUnlocked = false;

  const totalShards = zones.filter((zone) => zone.type === "shard").length;
  const totalTerminals = zones.filter((zone) => zone.type === "terminal").length;

  let background: Sprite;
  let foreground: Sprite;
  let player: Sprite;
  let shardImage: HTMLImageElement | null = null;
  let moveables: Array<Sprite | Boundary> = [];

  let dpr = 1;
  let renderScale = 1;
  let offsetX = 0;
  let offsetY = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    renderScale = Math.min(rect.width / WORLD_WIDTH, rect.height / WORLD_HEIGHT);
    const worldPixelWidth = WORLD_WIDTH * renderScale;
    const worldPixelHeight = WORLD_HEIGHT * renderScale;
    offsetX = (rect.width - worldPixelWidth) / 2;
    offsetY = (rect.height - worldPixelHeight) / 2;
  };

  const keydownHandler = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key === "w" || key === "a" || key === "s" || key === "d") {
      keyboard[key] = true;
      keyboard.lastKey = key;
    }

    if (key === "e") {
      interactRequested = true;
    }
  };

  const keyupHandler = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key === "w" || key === "a" || key === "s" || key === "d") {
      keyboard[key] = false;
    }
  };

  const visibilityHandler = () => {
    if (document.hidden) {
      running = false;
      window.cancelAnimationFrame(rafId);
      return;
    }

    if (!destroyed) {
      running = true;
      step();
    }
  };

  const resolveDirection = () => {
    const keyboardPressed = keyboard.w || keyboard.a || keyboard.s || keyboard.d;

    if (keyboardPressed) {
      const activeFallback = ([
        keyboard.d ? "d" : null,
        keyboard.a ? "a" : null,
        keyboard.s ? "s" : null,
        keyboard.w ? "w" : null,
      ].find(Boolean) ?? "s") as InputDirection;

      const resolvedLast = keyboard[keyboard.lastKey] ? keyboard.lastKey : activeFallback;
      keyboard.lastKey = resolvedLast;

      return {
        w: keyboard.w,
        a: keyboard.a,
        s: keyboard.s,
        d: keyboard.d,
        last: resolvedLast,
        speedScale: 1,
      };
    }

    if (!joystick.active) {
      return {
        w: false,
        a: false,
        s: false,
        d: false,
        last: keyboard.lastKey,
        speedScale: 1,
      };
    }

    const magnitude = Math.hypot(joystick.x, joystick.y);
    if (magnitude < JOYSTICK_DEADZONE) {
      return {
        w: false,
        a: false,
        s: false,
        d: false,
        last: keyboard.lastKey,
        speedScale: 1,
      };
    }

    const horizontalDominant = Math.abs(joystick.x) > Math.abs(joystick.y);

    if (horizontalDominant) {
      if (joystick.x > 0) {
        return {
          w: false,
          a: false,
          s: false,
          d: true,
          last: "d" as InputDirection,
          speedScale: Math.min(1, Math.max(0.55, magnitude)),
        };
      }

      return {
        w: false,
        a: true,
        s: false,
        d: false,
        last: "a" as InputDirection,
        speedScale: Math.min(1, Math.max(0.55, magnitude)),
      };
    }

    if (joystick.y > 0) {
      return {
        w: false,
        a: false,
        s: true,
        d: false,
        last: "s" as InputDirection,
        speedScale: Math.min(1, Math.max(0.55, magnitude)),
      };
    }

    return {
      w: true,
      a: false,
      s: false,
      d: false,
      last: "w" as InputDirection,
      speedScale: Math.min(1, Math.max(0.55, magnitude)),
    };
  };

  const moveWorld = (axis: "x" | "y", delta: number) => {
    moveables.forEach((moveable) => {
      moveable.position[axis] += delta;
    });

    // Keep interactive zones map-anchored by translating them with the world.
    zones.forEach((zone) => {
      if (axis === "x") {
        zone.x += delta;
      } else {
        zone.y += delta;
      }
    });
  };

  const canMove = (axis: "x" | "y", velocity: number) => {
    for (let i = 0; i < boundaries.length; i += 1) {
      const boundary = boundaries[i];
      const shifted = {
        ...boundary,
        position: {
          x: axis === "x" ? boundary.position.x + velocity : boundary.position.x,
          y: axis === "y" ? boundary.position.y + velocity : boundary.position.y,
        },
      };

      if (
        rectCollision({
          rect1: player,
          rect2: shifted,
        })
      ) {
        return false;
      }
    }

    return true;
  };

  const drawScene = () => {
    const nowMs = performance.now();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(dpr * renderScale, 0, 0, dpr * renderScale, dpr * offsetX, dpr * offsetY);

    background.draw(ctx);
    boundaries.forEach((boundary) => boundary.draw(ctx));
    zones.forEach((zone) => {
      if (zone.type === "shard" && !zone.collected) {
        drawShardEffect(ctx, zone, nowMs, shardImage);
      }

      if (zone.type === "terminal") {
        drawTerminalEffect(ctx, zone, nowMs, Boolean(zone.visited));
      }

      if (zone.type === "portal" && portalUnlocked) {
        drawPortalEffect(ctx, zone, nowMs);
      }
    });
    player.draw(ctx);
    foreground.draw(ctx);
  };

  const evaluatePortalUnlock = () => {
    const collectedShards = zones.filter((zone) => zone.type === "shard" && zone.collected).length;
    const visitedTerminals = zones.filter((zone) => zone.type === "terminal" && zone.visited).length;
    const unlocked = collectedShards === totalShards && visitedTerminals === totalTerminals;

    if (unlocked !== portalUnlocked) {
      portalUnlocked = unlocked;
      options.onPortalStateChange?.(portalUnlocked);
    }
  };

  const canTrigger = (id: string) => {
    const now = Date.now();
    const last = interactionCooldown.get(id) ?? 0;

    if (now - last < INTERACTION_COOLDOWN_MS) {
      return false;
    }

    interactionCooldown.set(id, now);
    return true;
  };

  const handleInteractions = () => {
    if (!player) {
      return;
    }

    const shouldInteract = interactRequested;
    interactRequested = false;

    zones.forEach((zone) => {
      if (!zoneCollision(player, zone)) {
        return;
      }

      if (zone.type === "shard" && !zone.collected && canTrigger(zone.id)) {
        zone.collected = true;
        const collectedShards = zones.filter((entry) => entry.type === "shard" && entry.collected).length;
        options.onShardUpdate?.(collectedShards, totalShards);

        if (!quoteUnlocked && collectedShards === totalShards) {
          quoteUnlocked = true;
          options.onQuoteUnlocked?.(DEV_JOURNEY_QUOTE);
        }

        evaluatePortalUnlock();
      }

      if (zone.type === "terminal" && shouldInteract && !zone.visited && canTrigger(zone.id)) {
        zone.visited = true;
        const snippet = TERMINAL_SNIPPETS.find((entry) => entry.id === zone.snippetId);
        const visitedTerminals = zones.filter((entry) => entry.type === "terminal" && entry.visited).length;

        if (snippet) {
          options.onTerminalTrigger?.(snippet, visitedTerminals, totalTerminals);
        }

        evaluatePortalUnlock();
      }

      if (zone.type === "portal" && shouldInteract && portalUnlocked && canTrigger(zone.id)) {
        options.onPortalEnter?.();
      }
    });
  };

  const step = () => {
    if (!running || destroyed) {
      return;
    }

    const direction = resolveDirection();
    const speed = BASE_SPEED * direction.speedScale;

    const movementConfig: Record<
      InputDirection,
      {
        active: boolean;
        axis: "x" | "y";
        velocity: number;
        sprite: HTMLImageElement | undefined;
      }
    > = {
      w: {
        active: direction.w,
        axis: "y",
        velocity: speed,
        sprite: player.sprites?.up,
      },
      s: {
        active: direction.s,
        axis: "y",
        velocity: -speed,
        sprite: player.sprites?.down,
      },
      a: {
        active: direction.a,
        axis: "x",
        velocity: speed,
        sprite: player.sprites?.left,
      },
      d: {
        active: direction.d,
        axis: "x",
        velocity: -speed,
        sprite: player.sprites?.right,
      },
    };

    const facing = direction.last;
    const movement = movementConfig[facing];

    let moved = false;

    if (movement.active) {
      if (movement.sprite) {
        player.image = movement.sprite;
      }

      if (canMove(movement.axis, movement.velocity)) {
        moveWorld(movement.axis, movement.velocity);
        moved = true;
      }
    }

    player.moving = moved;

    if (!moved) {
      const idleSpriteByDirection: Record<InputDirection, HTMLImageElement | undefined> = {
        w: player.sprites?.up,
        a: player.sprites?.left,
        s: player.sprites?.down,
        d: player.sprites?.right,
      };

      const idleSprite = idleSpriteByDirection[facing];
      if (idleSprite) {
        player.image = idleSprite;
      }

      // Snap back to the first frame of the current facing direction while idle.
      player.frames.val = 0;
      player.frames.elapsed = 0;
    }

    keyboard.lastKey = direction.last;
    handleInteractions();

    drawScene();
    rafId = window.requestAnimationFrame(step);
  };

  const start = async () => {
    if (running) {
      return;
    }

    try {
      const [
        collisionData,
        mapImage,
        foregroundImage,
        playerUpImage,
        playerLeftImage,
        playerRightImage,
        playerDownImage,
      ] = await Promise.all([
        fetch("/games/pellet-town/data/collisions.json").then((response) => {
          if (!response.ok) {
            throw new Error("Could not load collision map");
          }
          return response.json() as Promise<number[]>;
        }),
        loadImage("/games/pellet-town/img/Pellet Town.png"),
        loadImage("/games/pellet-town/img/foregroundImage.png"),
        loadImage("/games/pellet-town/img/playerUp.png"),
        loadImage("/games/pellet-town/img/playerLeft.png"),
        loadImage("/games/pellet-town/img/playerRight.png"),
        loadImage("/games/pellet-town/img/playerDown.png"),
      ]);

      try {
        shardImage = await loadImage("/games/pellet-town/img/shard.png");
      } catch {
        shardImage = null;
      }

      if (destroyed) {
        return;
      }

      const collisionRows = collisionMapFromData(collisionData);
      collisionRows.forEach((row, i) => {
        row.forEach((symbol, j) => {
          if (symbol === 1025) {
            boundaries.push(
              new Boundary({
                position: {
                  x: j * Boundary.width + offset.x,
                  y: i * Boundary.height + offset.y,
                },
              }),
            );
          }
        });
      });

      background = new Sprite({
        position: { x: offset.x, y: offset.y },
        image: mapImage,
      });

      foreground = new Sprite({
        position: { x: offset.x, y: offset.y },
        image: foregroundImage,
      });

      player = new Sprite({
        position: {
          x: WORLD_WIDTH / 2 - 192 / 8,
          y: WORLD_HEIGHT / 2 - 68 / 2,
        },
        image: playerDownImage,
        frames: { max: 4 },
        sprites: {
          up: playerUpImage,
          left: playerLeftImage,
          right: playerRightImage,
          down: playerDownImage,
        },
      });

      moveables = [background, ...boundaries, foreground];

      options.onShardUpdate?.(0, totalShards);
      options.onPortalStateChange?.(portalUnlocked);

      resize();
      window.addEventListener("resize", resize);
      window.addEventListener("keydown", keydownHandler);
      window.addEventListener("keyup", keyupHandler);
      document.addEventListener("visibilitychange", visibilityHandler);

      running = true;
      options.onReady?.();
      step();
    } catch {
      options.onError?.("Could not boot the easter egg map. Try refresh.");
    }
  };

  const setJoystick = (state: JoystickState) => {
    joystick = state;
  };

  const requestInteract = () => {
    interactRequested = true;
  };

  const destroy = () => {
    destroyed = true;
    running = false;
    window.cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("keyup", keyupHandler);
    document.removeEventListener("visibilitychange", visibilityHandler);
  };

  return {
    start,
    destroy,
    setJoystick,
    requestInteract,
  };
}
