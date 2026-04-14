"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  automatic = false,
  textClassName,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  textClassName?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const isActive = automatic || hovered;

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => {
        if (!automatic) setHovered(true);
      }}
      onMouseLeave={() => {
        if (!automatic) setHovered(false);
      }}
      onMouseMove={(e) => {
        if (!automatic) setCursor({ x: e.clientX, y: e.clientY });
      }}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {isActive && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={
            automatic
              ? {
                  cx: ["18%", "50%", "82%", "58%", "24%", "18%"],
                  cy: ["26%", "14%", "52%", "82%", "34%", "26%"],
                }
              : maskPosition
          }
          transition={
            automatic
              ? {
                  duration: duration ?? 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }
              : { duration: duration ?? 0, ease: "easeOut" }
          }
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={cn(
          "fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold",
          textClassName,
        )}
        style={{ opacity: isActive ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={cn(
          "fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold",
          textClassName,
        )}
        initial={automatic ? false : { strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={
          automatic
            ? {
                strokeDashoffset: [1000, 0, 0, 1000],
                opacity: [0.18, 1, 1, 0.18],
              }
            : {
                strokeDashoffset: 0,
                strokeDasharray: 1000,
              }
        }
        transition={
          automatic
            ? {
                duration: duration ? duration * 5 : 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.3, 0.72, 1],
              }
            : {
                duration: 4,
                ease: "easeInOut",
              }
        }
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className={cn("fill-transparent font-[helvetica] text-7xl font-bold", textClassName)}
      >
        {text}
      </text>
    </svg>
  );
};
