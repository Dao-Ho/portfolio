"use client";

import {
    motion,
    MotionValue,
    useMotionValue,
    useSpring,
    useTransform,
    type SpringOptions,
    AnimatePresence,
} from "framer-motion";
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState, useId } from "react";

type GlassSurfaceProps = {
    children?: React.ReactNode;
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    borderWidth?: number;
    brightness?: number;
    opacity?: number;
    blur?: number;
    displace?: number;
    backgroundOpacity?: number;
    saturation?: number;
    distortionScale?: number;
    redOffset?: number;
    greenOffset?: number;
    blueOffset?: number;
    xChannel?: string;
    yChannel?: string;
    mixBlendMode?: string;
    className?: string;
    style?: React.CSSProperties;
    isDarkMode?: boolean;
};

const GlassSurface = ({
    children,
    width = 200,
    height = 80,
    borderRadius = 20,
    borderWidth = 0.07,
    brightness = 50,
    opacity = 0.93,
    blur = 11,
    displace = 0,
    backgroundOpacity = 0,
    saturation = 1,
    distortionScale = -180,
    redOffset = 0,
    greenOffset = 10,
    blueOffset = 20,
    xChannel = "R",
    yChannel = "G",
    mixBlendMode = "difference",
    className = "",
    style = {},
    isDarkMode = false,
}: GlassSurfaceProps) => {
    const uniqueId = useId().replace(/:/g, "-");
    const filterId = `glass-filter-${uniqueId}`;
    const redGradId = `red-grad-${uniqueId}`;
    const blueGradId = `blue-grad-${uniqueId}`;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const feImageRef = useRef<SVGFEImageElement | null>(null);
    const redChannelRef = useRef<SVGFEDisplacementMapElement | null>(null);
    const greenChannelRef = useRef<SVGFEDisplacementMapElement | null>(null);
    const blueChannelRef = useRef<SVGFEDisplacementMapElement | null>(null);
    const gaussianBlurRef = useRef<SVGFEGaussianBlurElement | null>(null);

    const generateDisplacementMap = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        const actualWidth = rect?.width || 400;
        const actualHeight = rect?.height || 200;
        const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

        const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;

        return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    };

    const updateDisplacementMap = () => {
        feImageRef.current?.setAttribute("href", generateDisplacementMap());
    };

    useEffect(() => {
        updateDisplacementMap();
        [
            { ref: redChannelRef, offset: redOffset },
            { ref: greenChannelRef, offset: greenOffset },
            { ref: blueChannelRef, offset: blueOffset },
        ].forEach(({ ref, offset }) => {
            if (ref.current) {
                ref.current.setAttribute("scale", (distortionScale + offset).toString());
                ref.current.setAttribute("xChannelSelector", xChannel);
                ref.current.setAttribute("yChannelSelector", yChannel);
            }
        });

        gaussianBlurRef.current?.setAttribute("stdDeviation", displace.toString());
    }, [
        width,
        height,
        borderRadius,
        borderWidth,
        brightness,
        opacity,
        blur,
        displace,
        distortionScale,
        redOffset,
        greenOffset,
        blueOffset,
        xChannel,
        yChannel,
        mixBlendMode,
    ]);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            setTimeout(updateDisplacementMap, 0);
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        setTimeout(updateDisplacementMap, 0);
    }, [width, height]);

    const supportsSVGFilters = () => {
        const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        const isFirefox = /Firefox/.test(navigator.userAgent);

        if (isWebkit || isFirefox) {
            return false;
        }

        const div = document.createElement("div");
        div.style.backdropFilter = `url(#${filterId})`;
        return div.style.backdropFilter !== "";
    };

    const supportsBackdropFilter = () => {
        if (typeof window === "undefined") return false;
        return CSS.supports("backdrop-filter", "blur(10px)");
    };

    const getContainerStyles = () => {
        const baseStyles = {
            ...style,
            width: style.width || (typeof width === "number" ? `${width}px` : width),
            height: style.height || (typeof height === "number" ? `${height}px` : height),
            borderRadius: `${borderRadius}px`,
            "--glass-frost": backgroundOpacity,
            "--glass-saturation": saturation,
        };

        const svgSupported = supportsSVGFilters();
        const backdropFilterSupported = supportsBackdropFilter();

        if (svgSupported) {
            return {
                ...baseStyles,
                background: isDarkMode
                    ? `hsl(0 0% 0% / ${backgroundOpacity})`
                    : `hsl(0 0% 100% / ${backgroundOpacity})`,
                backdropFilter: `url(#${filterId}) saturate(${saturation})`,
                boxShadow: isDarkMode
                    ? `0 0 2px 1px color-mix(in oklch, white, transparent 65%) inset,
             0 0 10px 4px color-mix(in oklch, white, transparent 85%) inset,
             0px 4px 16px rgba(17, 17, 26, 0.05),
             0px 8px 24px rgba(17, 17, 26, 0.05),
             0px 16px 56px rgba(17, 17, 26, 0.05),
             0px 4px 16px rgba(17, 17, 26, 0.05) inset,
             0px 8px 24px rgba(17, 17, 26, 0.05) inset,
             0px 16px 56px rgba(17, 17, 26, 0.05) inset`
                    : `0 0 2px 1px color-mix(in oklch, black, transparent 85%) inset,
             0 0 10px 4px color-mix(in oklch, black, transparent 90%) inset,
             0px 4px 16px rgba(17, 17, 26, 0.05),
             0px 8px 24px rgba(17, 17, 26, 0.05),
             0px 16px 56px rgba(17, 17, 26, 0.05),
             0px 4px 16px rgba(17, 17, 26, 0.05) inset,
             0px 8px 24px rgba(17, 17, 26, 0.05) inset,
             0px 16px 56px rgba(17, 17, 26, 0.05) inset`,
            };
        } else {
            if (isDarkMode) {
                if (!backdropFilterSupported) {
                    return {
                        ...baseStyles,
                        background: "rgba(0, 0, 0, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)`,
                    };
                } else {
                    return {
                        ...baseStyles,
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(12px) saturate(1.8) brightness(1.2)",
                        WebkitBackdropFilter: "blur(12px) saturate(1.8) brightness(1.2)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)`,
                    };
                }
            } else {
                if (!backdropFilterSupported) {
                    return {
                        ...baseStyles,
                        background: "rgba(255, 255, 255, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.3)`,
                    };
                } else {
                    return {
                        ...baseStyles,
                        background: "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(12px) saturate(1.8) brightness(1.1)",
                        WebkitBackdropFilter: "blur(12px) saturate(1.8) brightness(1.1)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.2),
                        0 2px 16px 0 rgba(31, 38, 135, 0.1),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.2)`,
                    };
                }
            }
        }
    };

    const glassSurfaceClasses =
        "relative flex items-center justify-center overflow-hidden transition-opacity duration-[260ms] ease-out";

    const focusVisibleClasses = isDarkMode
        ? "focus-visible:outline-2 focus-visible:outline-[#0A84FF] focus-visible:outline-offset-2"
        : "focus-visible:outline-2 focus-visible:outline-[#007AFF] focus-visible:outline-offset-2";

    return (
        <div
            ref={containerRef}
            className={`${glassSurfaceClasses} ${focusVisibleClasses} ${className}`}
            style={getContainerStyles()}
        >
            <svg
                className="w-full h-full pointer-events-none absolute inset-0 opacity-0 -z-10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
                        <feImage
                            ref={feImageRef}
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            preserveAspectRatio="none"
                            result="map"
                        />

                        <feDisplacementMap
                            ref={redChannelRef}
                            in="SourceGraphic"
                            in2="map"
                            id="redchannel"
                            result="dispRed"
                        />
                        <feColorMatrix
                            in="dispRed"
                            type="matrix"
                            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                            result="red"
                        />

                        <feDisplacementMap
                            ref={greenChannelRef}
                            in="SourceGraphic"
                            in2="map"
                            id="greenchannel"
                            result="dispGreen"
                        />
                        <feColorMatrix
                            in="dispGreen"
                            type="matrix"
                            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                            result="green"
                        />

                        <feDisplacementMap
                            ref={blueChannelRef}
                            in="SourceGraphic"
                            in2="map"
                            id="bluechannel"
                            result="dispBlue"
                        />
                        <feColorMatrix
                            in="dispBlue"
                            type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                            result="blue"
                        />

                        <feBlend in="red" in2="green" mode="screen" result="rg" />
                        <feBlend in="rg" in2="blue" mode="screen" result="output" />
                        <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
                    </filter>
                </defs>
            </svg>
            <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
                {children}
            </div>
        </div>
    );
};

// Helper function for text color
const getAccentColor = (isDark: boolean): string => {
    return isDark ? "#edeef0" : "#343434";
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
    className = "",
    iconClassName = "",
    onClick,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize,
    isLight = false,
}: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, (val) => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: baseItemSize,
        };
        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(
        mouseDistance,
        [-distance, 0, distance],
        [baseItemSize, magnification, baseItemSize]
    );
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size,
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`relative inline-flex items-center justify-center ${className}`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            <GlassSurface
                borderRadius={16}
                borderWidth={0.07}
                brightness={50}
                opacity={0.93}
                blur={11}
                displace={0}
                backgroundOpacity={0}
                saturation={1}
                distortionScale={-180}
                redOffset={0}
                greenOffset={10}
                blueOffset={20}
                xChannel="R"
                yChannel="G"
                mixBlendMode="difference"
                style={{ width: "100%", height: "100%" }}
                className="rounded-full"
                isDarkMode={true}
            >
                {Children.map(children, (child) => {
                    if (!React.isValidElement(child)) return child;
                    if (child.type === DockIcon) {
                        return cloneElement(child as React.ReactElement<{ className?: string; isLight?: boolean }>, {
                            className: iconClassName,
                            isLight,
                        });
                    }
                    return cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, {
                        isHovered,
                    });
                })}
            </GlassSurface>
        </motion.div>
    );
}

type DockIconProps = {
    className?: string;
    children: React.ReactNode;
    isHovered?: MotionValue<number>;
    isLight?: boolean;
};

function DockIcon({ children, className = "", isLight = false }: DockIconProps) {
    const accentColor = getAccentColor(!isLight);
    return (
        <div className={`flex items-center justify-center ${className}`} style={{ color: accentColor }}>
            {children}
        </div>
    );
}

export default function Dock({
    items,
    className = "",
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelHeight = 64,
    dockHeight = 256,
    baseItemSize = 50,
    isLight = false,
}: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    const maxHeight = useMemo(
        () => Math.max(dockHeight, magnification + magnification / 2 + 4),
        [magnification, dockHeight]
    );
    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
    const height = useSpring(heightRow, spring);

    return (
        <motion.div
            style={{
                height,
                scrollbarWidth: "none",
            }}
            className="mx-2 flex max-w-full items-center"
        >
            <GlassSurface
                borderRadius={24}
                displace={8}
                distortionScale={-80}
                redOffset={2}
                greenOffset={8}
                blueOffset={15}
                brightness={55}
                opacity={0.85}
                mixBlendMode="normal"
                style={{ width: "auto", height: "auto" }}
                isDarkMode={true}
            >
                <motion.div
                    onMouseMove={({ pageX }) => {
                        isHovered.set(1);
                        mouseX.set(pageX);
                    }}
                    onMouseLeave={() => {
                        isHovered.set(0);
                        mouseX.set(Infinity);
                    }}
                    className={`${className} relative flex items-end w-fit gap-4 p-2`}
                    style={{
                        height: panelHeight,
                    }}
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
                            spring={spring}
                            distance={distance}
                            magnification={magnification}
                            baseItemSize={baseItemSize}
                            isLight={isLight}
                        >
                            <DockIcon>{item.icon}</DockIcon>
                        </DockItem>
                    ))}
                </motion.div>
            </GlassSurface>
        </motion.div>
    );
}
