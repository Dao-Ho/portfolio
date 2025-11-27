"use client";

import React, { useEffect, useRef, useState } from "react";
import { IterationCw } from "lucide-react";

export interface LogoMapConfig {
  gridWidth: number;
  gridHeight: number;
  dotPositions: boolean[][];
  spacing: number;
  colors?: string[][]; // Pre-calculated colors from generator
}

interface DotGridProps {
  logoMap: LogoMapConfig;
  isLight: boolean;
  dotSize?: number;
  touchedColor?: string; // Color when touched
  gradientColors?: string[]; // Array of colors for gradient transition
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  touched: boolean;
  touchProgress: number;
  targetColor: string; // Pre-calculated gradient color
}

const InteractiveLogoDots: React.FC<DotGridProps> = ({
  logoMap,
  isLight,
  dotSize = 4,
  touchedColor,
  gradientColors,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const [isResetHovering, setIsResetHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRadius = 100;

  // Initialize dots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dots: Dot[] = [];
    const gap = dotSize * (logoMap.spacing || 2) * 0.5;
    const cellSize = dotSize + gap;

    // Calculate canvas size
    const canvasWidth = logoMap.gridWidth * cellSize;
    const canvasHeight = logoMap.gridHeight * cellSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Create dots with base positions
    logoMap.dotPositions.forEach((row, y) => {
      row.forEach((isLogo, x) => {
        if (isLogo) {
          const baseX = x * cellSize + dotSize / 2;
          const baseY = y * cellSize + dotSize / 2;
          
          // Get pre-calculated color or use gradient calculation as fallback
          const targetColor = logoMap.colors?.[y]?.[x] || 
                             (gradientColors ? getGradientColorByPosition(x, logoMap.gridWidth) : 
                             (touchedColor || "#3c7cff"));

          dots.push({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            baseX,
            baseY,
            touched: false,
            touchProgress: 0,
            targetColor,
          });
        }
      });
    });

    dotsRef.current = dots;
    
    // Helper for fallback gradient calculation
    function getGradientColorByPosition(x: number, width: number): string {
      if (!gradientColors || gradientColors.length === 0) return "#3c7cff";
      if (gradientColors.length === 1) return gradientColors[0];
      
      const positionProgress = x / width;
      const scaledProgress = positionProgress * (gradientColors.length - 1);
      const index = Math.floor(scaledProgress);
      const nextIndex = Math.min(index + 1, gradientColors.length - 1);
      const localProgress = scaledProgress - index;
      
      return interpolateColor(gradientColors[index], gradientColors[nextIndex], localProgress);
    }
    
    function interpolateColor(color1: string, color2: string, factor: number): string {
      const c1 = hexToRgb(color1);
      const c2 = hexToRgb(color2);
      
      const r = Math.round(c1.r + (c2.r - c1.r) * factor);
      const g = Math.round(c1.g + (c2.g - c1.g) * factor);
      const b = Math.round(c1.b + (c2.b - c1.b) * factor);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    function hexToRgb(hex: string) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    }
  }, [logoMap, dotSize, touchedColor, gradientColors]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouseRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dotsRef.current.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Helper to convert color to grayscale
    const toGrayscale = (color: string): string => {
      const rgb = hexToRgb(color);
      // Calculate luminance
      const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
      return `rgb(${gray}, ${gray}, ${gray})`;
    };
    
    // Helper to interpolate between two hex colors
    const interpolateColor = (color1: string, color2: string, factor: number): string => {
      const c1 = hexToRgb(color1);
      const c2 = hexToRgb(color2);
      
      const r = Math.round(c1.r + (c2.r - c1.r) * factor);
      const g = Math.round(c1.g + (c2.g - c1.g) * factor);
      const b = Math.round(c1.b + (c2.b - c1.b) * factor);
      
      return `rgb(${r}, ${g}, ${b})`;
    };
    
    const hexToRgb = (hex: string) => {
      // Handle rgb() format
      if (hex.startsWith('rgb')) {
        const match = hex.match(/\d+/g);
        if (match && match.length >= 3) {
          return {
            r: parseInt(match[0]),
            g: parseInt(match[1]),
            b: parseInt(match[2])
          };
        }
      }
      
      // Handle hex format
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const dots = dotsRef.current;
      const radiusSquared = mouseRadius * mouseRadius;

      // Update and draw dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Calculate actual position
        const currentX = dot.baseX + dot.x;
        const currentY = dot.baseY + dot.y;

        const dx = mouse.x - currentX;
        const dy = mouse.y - currentY;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < radiusSquared && distanceSquared > 0) {
          const distance = Math.sqrt(distanceSquared);
          const force = (mouseRadius - distance) / mouseRadius;
          const angle = Math.atan2(dy, dx);

          const pushStrength = force * force * 2.5;
          dot.vx -= pushStrength * Math.cos(angle);
          dot.vy -= pushStrength * Math.sin(angle);

          if (!dot.touched) {
            dot.touched = true;
          }
        }

        // Animate touch progress for smooth transition
        if (dot.touched && dot.touchProgress < 1) {
          dot.touchProgress += 0.05;
          if (dot.touchProgress > 1) dot.touchProgress = 1;
        } else if (!dot.touched && dot.touchProgress > 0) {
          dot.touchProgress -= 0.05;
          if (dot.touchProgress < 0) dot.touchProgress = 0;
        }

        // Apply friction
        dot.vx *= 0.92;
        dot.vy *= 0.92;

        // Spring back to origin
        dot.x += dot.vx + (0 - dot.x) * 0.15;
        dot.y += dot.vy + (0 - dot.y) * 0.15;

        // Draw dot - show grayscale version when not touched, full color when touched
        let dotColor;
        if (dot.touchProgress === 0) {
          // Not touched - show grayscale version of target color
          dotColor = toGrayscale(dot.targetColor);
        } else if (dot.touchProgress === 1) {
          // Fully touched - show full color
          dotColor = dot.targetColor;
        } else {
          // Transitioning - interpolate from grayscale to full color
          const grayColor = toGrayscale(dot.targetColor);
          dotColor = interpolateColor(grayColor, dot.targetColor, dot.touchProgress);
        }
          
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(currentX, currentY, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dotsRef.current.length, dotSize]);

  const resetGrid = () => {
    dotsRef.current.forEach((dot) => {
      dot.touched = false;
      dot.touchProgress = 0;
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-4 items-center">
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
        }}
      />

      <div className="flex justify-end w-full">
        <span
          className="text-md font-light opacity-70 cursor-pointer transition-colors duration-300"
          onClick={resetGrid}
          onMouseEnter={(e) => {
            setIsResetHovering(true);
            e.currentTarget.style.color = "#3c7cff";
          }}
          onMouseLeave={(e) => {
            setIsResetHovering(false);
            e.currentTarget.style.color = isLight ? "#262523" : "#cbd0d2";
          }}
        >
          Reset
          <IterationCw
            className="inline-block transition-all duration-300 ml-1"
            size={16}
            style={{
              transform: isResetHovering ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default InteractiveLogoDots;