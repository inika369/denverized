"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import {
  MAX_LEVEL,
  PLAYER_LEVELS,
  salaryToScore,
  type PlayerLevel,
} from "./playerLevels";

const WIDTH = 380;
const HEIGHT = 560;
const WALL_THICKNESS = 24;
const CAP_LINE_Y = 90;
const SPAWN_Y = 50;

// Purely decorative threshold lines below the game-over line; they have no
// effect on gameplay. Spacing is half of the original even-quarters layout,
// so the four lines sit closer together near the top of the play area.
const DECORATIVE_LINES_END_Y = HEIGHT * 0.75;
const ORIGINAL_DECORATIVE_LINE_GAP = (DECORATIVE_LINES_END_Y - CAP_LINE_Y) / 4;
const DECORATIVE_LINE_GAP = ORIGINAL_DECORATIVE_LINE_GAP / 2;
const FIRST_APRON_LINE_Y = CAP_LINE_Y + DECORATIVE_LINE_GAP;
const TAX_LINE_Y = CAP_LINE_Y + DECORATIVE_LINE_GAP * 2;
const SALARY_CAP_LINE_Y = CAP_LINE_Y + DECORATIVE_LINE_GAP * 3;
const DROP_COOLDOWN_MS = 400;
const OVERFLOW_GRACE_MS = 1000;
const OVERFLOW_LIMIT_MS = 1500;
const LEVEL9_BONUS_MULTIPLIER = 3;
const MAX_STARTING_LEVEL = 4;

const HIGH_SCORE_KEY = "denverized_salary_game_highscore";

type BallMeta = {
  level: number;
  spawnedAt: number;
};

type MergeEffect = {
  x: number;
  y: number;
  radius: number;
  color: string;
  createdAt: number;
};

function randomStartingLevel(): number {
  return 1 + Math.floor(Math.random() * MAX_STARTING_LEVEL);
}

function drawThresholdLine(
  ctx: CanvasRenderingContext2D,
  y: number,
  label: string
) {
  ctx.save();
  ctx.strokeStyle = "rgba(245, 245, 240, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(WIDTH, y);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "rgba(245, 245, 240, 0.45)";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(label, 6, y - 3);
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  images: Map<number, HTMLImageElement>,
  data: PlayerLevel,
  x: number,
  y: number,
  alpha = 1
) {
  const r = data.radius;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.closePath();

  const img = images.get(data.level);
  if (img) {
    ctx.save();
    ctx.clip();
    ctx.drawImage(img, -r, -r, r * 2, r * 2);
    ctx.restore();
  } else {
    ctx.fillStyle = data.color;
    ctx.fill();
  }

  ctx.lineWidth = Math.max(2, r * 0.06);
  ctx.strokeStyle = "#fec524";
  ctx.stroke();

  if (img) {
    // The image already shows the jersey number, so only overlay the
    // surname. A translucent backing keeps it legible over any artwork.
    const fontSize = Math.round(r * 0.22);
    const labelY = r * 0.42;
    ctx.font = `bold ${fontSize}px sans-serif`;
    const textWidth = ctx.measureText(data.surname).width;
    const paddingX = fontSize * 0.5;
    const paddingY = fontSize * 0.35;

    ctx.fillStyle = "rgba(14, 34, 64, 0.65)";
    ctx.fillRect(
      -textWidth / 2 - paddingX,
      labelY - fontSize / 2 - paddingY,
      textWidth + paddingX * 2,
      fontSize + paddingY * 2
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f5f5f0";
    ctx.fillText(data.surname, 0, labelY);
  } else {
    ctx.fillStyle = "#f5f5f0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.round(r * 0.55)}px sans-serif`;
    ctx.fillText(`#${data.number}`, 0, -r * 0.08);
    ctx.font = `bold ${Math.round(r * 0.22)}px sans-serif`;
    ctx.fillStyle = "#fec524";
    ctx.fillText(data.surname, 0, r * 0.42);
  }

  ctx.restore();
}

function GameCanvas({
  onScoreChange,
  onGameOver,
}: {
  onScoreChange: (score: number) => void;
  onGameOver: (finalScore: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const engine = Matter.Engine.create();
    const world = engine.world;

    const wallOptions: Matter.IChamferableBodyDefinition = { isStatic: true };
    const floor = Matter.Bodies.rectangle(
      WIDTH / 2,
      HEIGHT + WALL_THICKNESS / 2,
      WIDTH,
      WALL_THICKNESS,
      wallOptions
    );
    const leftWall = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      HEIGHT / 2,
      WALL_THICKNESS,
      HEIGHT,
      wallOptions
    );
    const rightWall = Matter.Bodies.rectangle(
      WIDTH + WALL_THICKNESS / 2,
      HEIGHT / 2,
      WALL_THICKNESS,
      HEIGHT,
      wallOptions
    );
    Matter.Composite.add(world, [floor, leftWall, rightWall]);

    const ballMeta = new Map<number, BallMeta>();
    const effects: MergeEffect[] = [];
    const images = new Map<number, HTMLImageElement>();
    PLAYER_LEVELS.forEach((p) => {
      const img = new window.Image();
      img.onload = () => images.set(p.level, img);
      img.src = `/players/player-${p.level}.png`;
    });

    let dropX = WIDTH / 2;
    let nextLevel = randomStartingLevel();
    let canDrop = true;
    let isOver = false;
    let overflowSince: number | null = null;
    let score = 0;
    let dropTimeoutId: number | null = null;

    function spawnBall(level: number, x: number, y: number) {
      const data = PLAYER_LEVELS[level - 1];
      const clampedX = Math.min(Math.max(x, data.radius), WIDTH - data.radius);
      const body = Matter.Bodies.circle(clampedX, y, data.radius, {
        restitution: 0.15,
        friction: 0.7,
        frictionStatic: 0.9,
        frictionAir: 0.002,
      });
      ballMeta.set(body.id, { level, spawnedAt: performance.now() });
      Matter.Composite.add(world, body);
      return body;
    }

    function handleMerge(bodyA: Matter.Body, bodyB: Matter.Body, level: number) {
      const midX = (bodyA.position.x + bodyB.position.x) / 2;
      const midY = (bodyA.position.y + bodyB.position.y) / 2;
      Matter.Composite.remove(world, bodyA);
      Matter.Composite.remove(world, bodyB);
      ballMeta.delete(bodyA.id);
      ballMeta.delete(bodyB.id);

      if (level >= MAX_LEVEL) {
        const bonus =
          salaryToScore(PLAYER_LEVELS[MAX_LEVEL - 1].salary) *
          LEVEL9_BONUS_MULTIPLIER;
        score += bonus;
        onScoreChange(score);
        effects.push({
          x: midX,
          y: midY,
          radius: PLAYER_LEVELS[MAX_LEVEL - 1].radius * 1.4,
          color: "#fec524",
          createdAt: performance.now(),
        });
        return;
      }

      const newLevel = level + 1;
      const newBody = spawnBall(newLevel, midX, midY);
      Matter.Body.setVelocity(newBody, { x: 0, y: -1 });

      score += salaryToScore(PLAYER_LEVELS[newLevel - 1].salary);
      onScoreChange(score);
      effects.push({
        x: midX,
        y: midY,
        radius: PLAYER_LEVELS[newLevel - 1].radius * 1.3,
        color: PLAYER_LEVELS[newLevel - 1].color,
        createdAt: performance.now(),
      });
    }

    const pendingMerges: {
      bodyA: Matter.Body;
      bodyB: Matter.Body;
      level: number;
    }[] = [];
    const mergingIds = new Set<number>();

    function onCollisionStart(event: Matter.IEventCollision<Matter.Engine>) {
      if (isOver) return;
      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair;
        const metaA = ballMeta.get(bodyA.id);
        const metaB = ballMeta.get(bodyB.id);
        if (!metaA || !metaB) continue;
        if (metaA.level !== metaB.level) continue;
        if (mergingIds.has(bodyA.id) || mergingIds.has(bodyB.id)) continue;
        mergingIds.add(bodyA.id);
        mergingIds.add(bodyB.id);
        pendingMerges.push({ bodyA, bodyB, level: metaA.level });
      }
    }

    function onAfterUpdate() {
      if (pendingMerges.length > 0) {
        for (const m of pendingMerges) {
          handleMerge(m.bodyA, m.bodyB, m.level);
          mergingIds.delete(m.bodyA.id);
          mergingIds.delete(m.bodyB.id);
        }
        pendingMerges.length = 0;
      }

      if (isOver) return;

      const now = performance.now();
      const bodies = Matter.Composite.allBodies(world);
      let overflowing = false;
      for (const body of bodies) {
        const meta = ballMeta.get(body.id);
        if (!meta) continue;
        if (now - meta.spawnedAt < OVERFLOW_GRACE_MS) continue;
        const data = PLAYER_LEVELS[meta.level - 1];
        if (body.position.y - data.radius < CAP_LINE_Y) {
          overflowing = true;
          break;
        }
      }

      if (overflowing) {
        if (overflowSince === null) {
          overflowSince = now;
        } else if (now - overflowSince >= OVERFLOW_LIMIT_MS) {
          isOver = true;
          Matter.Runner.stop(runner);
          onGameOver(score);
        }
      } else {
        overflowSince = null;
      }
    }

    Matter.Events.on(engine, "collisionStart", onCollisionStart);
    Matter.Events.on(engine, "afterUpdate", onAfterUpdate);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    function getCanvasX(clientX: number) {
      const rect = canvas!.getBoundingClientRect();
      const scale = WIDTH / rect.width;
      return (clientX - rect.left) * scale;
    }

    function updateDropX(clientX: number) {
      const radius = PLAYER_LEVELS[nextLevel - 1].radius;
      const x = getCanvasX(clientX);
      dropX = Math.min(Math.max(x, radius), WIDTH - radius);
    }

    function dropCurrentBall() {
      if (isOver || !canDrop) return;
      canDrop = false;
      spawnBall(nextLevel, dropX, SPAWN_Y);
      nextLevel = randomStartingLevel();
      dropTimeoutId = window.setTimeout(() => {
        canDrop = true;
      }, DROP_COOLDOWN_MS);
    }

    function handlePointerMove(e: PointerEvent) {
      updateDropX(e.clientX);
    }

    function handlePointerDown(e: PointerEvent) {
      updateDropX(e.clientX);
      // Touch: only track position here; the ball drops on release (pointerup)
      // so the player can drag to aim before letting go.
      if (e.pointerType === "touch") return;
      // Mouse (and pen): drop immediately, matching the existing click-to-drop feel.
      dropCurrentBall();
    }

    function handlePointerUp(e: PointerEvent) {
      if (e.pointerType !== "touch") return;
      updateDropX(e.clientX);
      dropCurrentBall();
    }

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);

    let rafId: number;
    function draw() {
      ctx!.clearRect(0, 0, WIDTH, HEIGHT);

      ctx!.fillStyle = "#0e2240";
      ctx!.fillRect(0, 0, WIDTH, HEIGHT);

      ctx!.save();
      ctx!.strokeStyle = "#ef4444";
      ctx!.lineWidth = 2;
      ctx!.setLineDash([6, 6]);
      ctx!.beginPath();
      ctx!.moveTo(0, CAP_LINE_Y);
      ctx!.lineTo(WIDTH, CAP_LINE_Y);
      ctx!.stroke();
      ctx!.restore();

      ctx!.fillStyle = "#ef4444";
      ctx!.font = "bold 11px sans-serif";
      ctx!.textAlign = "left";
      ctx!.textBaseline = "bottom";
      ctx!.fillText("2ndエプロン", 6, CAP_LINE_Y - 4);

      drawThresholdLine(ctx!, FIRST_APRON_LINE_Y, "1stエプロン");
      drawThresholdLine(ctx!, TAX_LINE_Y, "タックスライン");
      drawThresholdLine(ctx!, SALARY_CAP_LINE_Y, "サラリーキャップ");

      if (!isOver) {
        drawBall(ctx!, images, PLAYER_LEVELS[nextLevel - 1], dropX, SPAWN_Y, 0.55);
      }

      const bodies = Matter.Composite.allBodies(world);
      for (const body of bodies) {
        const meta = ballMeta.get(body.id);
        if (!meta) continue;
        const data = PLAYER_LEVELS[meta.level - 1];
        drawBall(ctx!, images, data, body.position.x, body.position.y);
      }

      const now = performance.now();
      for (let i = effects.length - 1; i >= 0; i--) {
        const eff = effects[i];
        const age = now - eff.createdAt;
        const duration = 350;
        if (age > duration) {
          effects.splice(i, 1);
          continue;
        }
        const t = age / duration;
        ctx!.save();
        ctx!.globalAlpha = 1 - t;
        ctx!.strokeStyle = eff.color;
        ctx!.lineWidth = 3;
        ctx!.beginPath();
        ctx!.arc(eff.x, eff.y, eff.radius * (0.7 + t * 0.6), 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.restore();
      }

      rafId = requestAnimationFrame(draw);
    }
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      if (dropTimeoutId !== null) window.clearTimeout(dropTimeoutId);
      Matter.Runner.stop(runner);
      Matter.Events.off(engine, "collisionStart", onCollisionStart);
      Matter.Events.off(engine, "afterUpdate", onAfterUpdate);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      Matter.Composite.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [onScoreChange, onGameOver]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full touch-none border-2 border-gold bg-navy"
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    />
  );
}

export default function SalaryCapStacker() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = window.localStorage.getItem(HIGH_SCORE_KEY);
    return stored ? Number(stored) || 0 : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleScoreChange = useCallback((next: number) => {
    setScore(next);
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setGameOver(true);
    setHighScore((prev) => {
      if (finalScore > prev) {
        window.localStorage.setItem(HIGH_SCORE_KEY, String(finalScore));
        return finalScore;
      }
      return prev;
    });
  }, []);

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="mx-auto max-w-[380px]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="pixel-shadow-sm flex-1 border-2 border-navy-light bg-navy px-4 py-2">
          <p className="text-[10px] text-foreground/50">スコア</p>
          <p className="font-pixel text-lg text-gold">{score}</p>
        </div>
        <div className="pixel-shadow-sm flex-1 border-2 border-navy-light bg-navy px-4 py-2 text-right">
          <p className="text-[10px] text-foreground/50">ハイスコア</p>
          <p className="font-pixel text-lg text-foreground">{highScore}</p>
        </div>
      </div>

      <div className="relative">
        <GameCanvas
          key={resetKey}
          onScoreChange={handleScoreChange}
          onGameOver={handleGameOver}
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 border-2 border-gold bg-navy-dark/95 p-6 text-center">
            <p className="text-base font-bold text-gold sm:text-lg">
              2ndエプロンを超えました。
              <br />
              覚悟を決めて優勝するかサラリーダンプしてください
            </p>
            <div>
              <p className="text-xs text-foreground/60">最終スコア</p>
              <p className="font-pixel text-2xl text-foreground">{score}</p>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="mt-2 bg-gold px-5 py-2 text-xs font-bold text-navy-dark transition-transform hover:-translate-y-0.5"
            >
              もう一度プレイ
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-foreground/50">
        画面をなぞって位置を調整し、タップ／クリックで<s>果物</s>選手を落とそう。同じ選手同士がぶつかると合体するよ。
      </p>
    </div>
  );
}
