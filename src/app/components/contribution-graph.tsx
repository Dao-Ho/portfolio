'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: Week[];
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar;
      };
    };
  };
  error?: string;
}

interface GitHubContributionGridProps {
  userName: string;
  isLight: boolean;
}

interface CellState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const GitHubContributionGrid: React.FC<GitHubContributionGridProps> = ({ userName, isLight }) => {
  const [contributions, setContributions] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cellStates, setCellStates] = useState<Map<string, CellState>>(new Map());
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch GitHub data
  useEffect(() => {
    fetch(`/api/github-contributions?userName=${userName}`)
      .then(res => res.json())
      .then((data: GitHubResponse | { error: string }) => {
        if ('error' in data) {
          console.error(data.error);
        } else {
          setContributions(data.data.user.contributionsCollection.contributionCalendar);
        }
      })
      .catch((err: Error) => console.error(err))
      .finally(() => setLoading(false));
  }, [userName]);

  // Initialize cell states
  useEffect(() => {
    if (!contributions) return;

    const initialStates = new Map<string, CellState>();
    contributions.weeks.forEach((week, weekIndex) => {
      week.contributionDays.forEach((day, dayIndex) => {
        const key = `${weekIndex}-${dayIndex}`;
        initialStates.set(key, { x: 0, y: 0, vx: 0, vy: 0 });
      });
    });
    setCellStates(initialStates);
  }, [contributions]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Physics animation
  useEffect(() => {
    if (!contributions || cellStates.size === 0) return;

    const animate = () => {
      const newStates = new Map(cellStates);
      const mouse = mouseRef.current;
      const mouseRadius = 100;
      
      newStates.forEach((state, key) => {
        const cellElement = document.getElementById(`cell-${key}`);
        if (!cellElement) return;

        const rect = cellElement.getBoundingClientRect();
        const cellCenterX = rect.left + rect.width / 2;
        const cellCenterY = rect.top + rect.height / 2;

        const dx = mouse.x - cellCenterX;
        const dy = mouse.y - cellCenterY;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSquared = mouseRadius * mouseRadius;

        if (distanceSquared < radiusSquared && distanceSquared > 0) {
          const distance = Math.sqrt(distanceSquared);
          const force = (mouseRadius - distance) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          
          const pushStrength = force * force * 2.5;
          state.vx -= pushStrength * Math.cos(angle);
          state.vy -= pushStrength * Math.sin(angle);
        }

        // Apply friction
        state.vx *= 0.92;
        state.vy *= 0.92;

        // Spring back to origin
        state.x += state.vx + (0 - state.x) * 0.15;
        state.y += state.vy + (0 - state.y) * 0.15;
      });

      setCellStates(newStates);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [contributions, cellStates.size]);

  const getColor = (count: number) => {
    if (count === 0) return isLight ? '#ebe6dd' : '#2d2c29';
    if (count < 2) return isLight ? '#cbbfaf' : '#3f3d3a';
    if (count < 5) return isLight ? '#a89582' : '#565350';
    if (count < 10) return isLight ? '#80705f' : '#6e6860';
    return isLight ? '#5a4d3f' : '#938d82';
  };

  if (loading) {
    return null;
  }

  if (!contributions) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className={isLight ? 'text-gray-800' : 'text-gray-200'}>
          Failed to load contributions
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="flex gap-1">
        {contributions.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-2">
            {week.contributionDays.map((day, dayIndex) => {
              const key = `${weekIndex}-${dayIndex}`;
              const state = cellStates.get(key) || { x: 0, y: 0, vx: 0, vy: 0 };
              
              return (
                <div
                  key={key}
                  id={`cell-${key}`}
                  className="w-[0.85vw] h-[0.85vw] rounded-[0.25vw]"
                  style={{
                    backgroundColor: getColor(day.contributionCount),
                    transform: `translate(${state.x}px, ${state.y}px)`,
                    willChange: 'transform'
                  }}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitHubContributionGrid;