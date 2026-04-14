import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";
import "./BorderGlow.css";

function parseHsl(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) {
    return { h: 40, s: 80, l: 80 };
  }

  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHsl(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};

  for (let index = 0; index < opacities.length; index += 1) {
    vars[`--glow-color${keys[index]}`] =
      `hsl(${base} / ${Math.min(opacities[index] * intensity, 100)}%)`;
  }

  return vars;
}

const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: readonly string[]) {
  const vars: Record<string, string> = {};

  for (let index = 0; index < 7; index += 1) {
    const color = colors[Math.min(COLOR_MAP[index], colors.length - 1)];
    vars[GRADIENT_KEYS[index]] =
      `radial-gradient(at ${GRADIENT_POSITIONS[index]}, ${color} 0px, transparent 50%)`;
  }

  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInCubic(value: number) {
  return value * value * value;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (value: number) => number;
  onUpdate: (value: number) => void;
  onEnd?: () => void;
}) {
  const targetStart = performance.now() + delay;

  function tick() {
    const elapsed = performance.now() - targetStart;
    const progress = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(progress));

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    onEnd?.();
  }

  window.setTimeout(() => requestAnimationFrame(tick), delay);
}

type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  alwaysOn?: boolean;
  colors?: readonly string[];
  fillOpacity?: number;
};

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#060010",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  alwaysOn = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0.5,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const getCenterOfElement = useCallback((element: HTMLDivElement) => {
    const { width, height } = element.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback(
    (element: HTMLDivElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(element);
      const dx = x - cx;
      const dy = y - cy;
      let kx = Infinity;
      let ky = Infinity;

      if (dx !== 0) {
        kx = cx / Math.abs(dx);
      }
      if (dy !== 0) {
        ky = cy / Math.abs(dy);
      }

      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [getCenterOfElement],
  );

  const getCursorAngle = useCallback(
    (element: HTMLDivElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(element);
      const dx = x - cx;
      const dy = y - cy;

      if (dx === 0 && dy === 0) {
        return 0;
      }

      const radians = Math.atan2(dy, dx);
      let degrees = radians * (180 / Math.PI) + 90;
      if (degrees < 0) {
        degrees += 360;
      }

      return degrees;
    },
    [getCenterOfElement],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);

      card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
      card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
    },
    [getCursorAngle, getEdgeProximity],
  );

  useEffect(() => {
    if (!animated || !cardRef.current) {
      return;
    }

    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;

    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);

    animateValue({
      duration: 500,
      onUpdate: (value) => card.style.setProperty("--edge-proximity", `${value}`),
    });
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (value) => {
        card.style.setProperty(
          "--cursor-angle",
          `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`,
        );
      },
    });
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (value) => {
        card.style.setProperty(
          "--cursor-angle",
          `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`,
        );
      },
    });
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (value) => card.style.setProperty("--edge-proximity", `${value}`),
      onEnd: () => card.classList.remove("sweep-active"),
    });
  }, [animated]);

  useEffect(() => {
    if (!alwaysOn || !cardRef.current) {
      return;
    }

    const card = cardRef.current;
    let frameId = 0;
    let startTime = 0;

    card.style.setProperty("--edge-proximity", "92");

    const loop = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = (timestamp - startTime) / 1000;
      const angle = (elapsed * 28) % 360;
      card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
      frameId = window.requestAnimationFrame(loop);
    };

    frameId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [alwaysOn]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${alwaysOn ? "always-on" : ""} ${className}`}
      style={
        {
          "--card-bg": backgroundColor,
          "--edge-sensitivity": edgeSensitivity,
          "--border-radius": `${borderRadius}px`,
          "--glow-padding": `${glowRadius}px`,
          "--cone-spread": coneSpread,
          "--fill-opacity": fillOpacity,
          ...glowVars,
          ...buildGradientVars(colors),
        } as CSSProperties
      }
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
