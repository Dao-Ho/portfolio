'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

const getAccentColor = (isLight: boolean): string => {
  return isLight ? '#1a1a1a' : '#edeef0';
};

const getBorderColor = (isLight: boolean): string => {
  return isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.6)';
};

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  isLight?: boolean;
};

type DockItemProps = {
  className?: string;
  iconClassName?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  isLight?: boolean;
};

function DockItem({
  children,
  className = '',
  iconClassName = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  isLight = false
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
        borderColor: getBorderColor(isLight),
        borderWidth: '1px'
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-white/6 backdrop-blur-sm shadow-lg ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        // Pass iconClassName to DockIcon component and isLight
        if (child.type === DockIcon) {
          return cloneElement(child as React.ReactElement<{ className?: string; isLight?: boolean }>, { className: iconClassName, isLight });
        }
        // Pass isLight to DockLabel
        if (child.type === DockLabel) {
          return cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number>; isLight?: boolean }>, { isHovered, isLight });
        }
        return cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered });
      })}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
  isLight?: boolean;
};

function DockLabel({ children, className = '', isHovered, isLight = false }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md bg-white/5 px-2 py-0.5 text-xs backdrop-blur-sm`}
          style={{ x: '-50%', borderColor: getBorderColor(isLight), borderWidth: '1px', color: getAccentColor(isLight) }}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
  isLight?: boolean;
};

function DockIcon({ children, className = '', isLight = false }: DockIconProps) {
  const accentColor = getAccentColor(isLight);
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {React.isValidElement(children) 
        ? cloneElement(children as React.ReactElement<any>, { 
            color: accentColor,
            style: { color: accentColor }
          })
        : children
      }
    </div>
  );
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
  isLight = false
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => Math.max(dockHeight, magnification + magnification / 2 + 4), [magnification]);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height, scrollbarWidth: 'none' }} className="mx-2 flex max-w-full items-center">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} flex items-end w-fit gap-4 rounded-3xl bg-white/5 bg-clip-padding backdrop-blur-lg p-2`}
        style={{ height: panelHeight, borderColor: getBorderColor(isLight), borderWidth: '1px' }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            iconClassName={item.iconClassName}
            mouseX={mouseX}
            isLight={isLight}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
