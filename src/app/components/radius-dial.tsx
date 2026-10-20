import React, { useEffect, useRef, useState } from "react";
import { animate, motion, MotionValue, useMotionValue, useTransform } from "motion/react";

const SIZE = 44;
const MAX_OVERFLOW = 40;
const MAX_TUG = 6;
const GUIDE_COUNT = 4;
const GUIDE_RATIO = 1.6;
const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;

interface RingProps {
    size: MotionValue<number>;
    className?: string;
    fill?: string;
    children?: React.ReactNode;
}

const Ring: React.FC<RingProps> = ({ size, className = "", fill, children }) => (
    <motion.div className="absolute left-0 top-0" style={{ width: size, height: size, x: "-50%", y: "-50%" }}>
        <div
            className={`absolute inset-0 rounded-full border border-current ${className}`}
            style={{ backgroundColor: fill }}
        >
            {children}
        </div>
    </motion.div>
);

interface GuideProps {
    zoom: MotionValue<number>;
    radius: number;
    className: string;
}

const Guide: React.FC<GuideProps> = ({ zoom, radius, className }) => {
    const size = useTransform(zoom, (z) => 2 * radius * z);
    return <Ring size={size} className={className} />;
};

interface RadiusDialProps {
    defaultValue?: number;
    startingValue?: number;
    maxValue?: number;
    stepSize?: number;
    isLight?: boolean;
    label?: string;
    onChange?: (value: number) => void;
}

const RadiusDial: React.FC<RadiusDialProps> = ({
    defaultValue = 50,
    startingValue = 0,
    maxValue = 100,
    stepSize = 1,
    isLight = true,
    label,
    onChange,
}) => {
    const restZoom = SIZE / 2 / maxValue;
    const [value, setValue] = useState<number>(defaultValue);
    const [isActive, setIsActive] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const drag = useRef<{ x: number; value: number; centerX: number; centerY: number } | null>(null);
    const radius = useMotionValue(defaultValue);
    const overflow = useMotionValue(0);
    const zoom = useMotionValue(restZoom);
    const offsetX = useMotionValue(0);
    const offsetY = useMotionValue(0);
    const valueSize = useTransform(() => 2 * Math.max(0, radius.get() + overflow.get()) * zoom.get());
    const color = isLight ? "#262523" : "#cbd0d2";

    useEffect(() => {
        setValue(defaultValue);
        radius.set(defaultValue);
    }, [defaultValue, radius]);

    useEffect(() => {
        animate(zoom, isActive ? 1 : restZoom, SPRING);
    }, [isActive, restZoom, zoom]);

    const commit = (next: number) => {
        const snapped = Math.round(next / stepSize) * stepSize;
        const clamped = Math.min(Math.max(snapped, startingValue), maxValue);
        if (clamped === value) return;
        animate(radius, clamped, SPRING);
        setValue(clamped);
        onChange?.(clamped);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        drag.current = { x: e.clientX, value, centerX: left + width / 2, centerY: top + height / 2 };
        setIsActive(true);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!drag.current) return;
        if (e.buttons === 0) return endDrag();
        offsetX.jump(tug(e.clientX - drag.current.centerX));
        offsetY.jump(tug(e.clientY - drag.current.centerY));
        const raw = drag.current.value + e.clientX - drag.current.x;
        overflow.jump(raw > maxValue ? decay(raw - maxValue, MAX_OVERFLOW) : 0);
        commit(raw);
    };

    const endDrag = () => {
        if (!drag.current) return;
        drag.current = null;
        setIsActive(false);
        animate(overflow, 0, { type: "spring", bounce: 0.5 });
        animate(offsetX, 0, SPRING);
        animate(offsetY, 0, SPRING);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const targets: Record<string, number> = {
            ArrowRight: value + stepSize,
            ArrowUp: value + stepSize,
            ArrowLeft: value - stepSize,
            ArrowDown: value - stepSize,
            Home: startingValue,
            End: maxValue,
        };
        if (!(e.key in targets)) return;
        e.preventDefault();
        commit(targets[e.key]);
    };

    const guides = Array.from({ length: GUIDE_COUNT }, (_, i) => maxValue / GUIDE_RATIO ** (GUIDE_COUNT - 1 - i));

    return (
        <div
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-valuemin={startingValue}
            aria-valuemax={maxValue}
            aria-valuenow={value}
            className={`relative shrink-0 touch-none select-none outline-none transition-opacity duration-500 ${isActive ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ width: SIZE, height: SIZE, color, opacity: isActive || isHovered ? 1 : 0.55 }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.currentTarget.matches(":focus-visible") && setIsActive(true)}
            onBlur={() => setIsActive(false)}
        >
            <motion.div className="pointer-events-none absolute left-1/2 top-1/2" style={{ x: offsetX, y: offsetY }}>
                {guides.map((r, i) => (
                    <Guide
                        key={r}
                        zoom={zoom}
                        radius={r}
                        className={
                            i === GUIDE_COUNT - 1
                                ? "border-dashed opacity-30 motion-safe:animate-[spin_40s_linear_infinite_reverse]"
                                : "opacity-[0.12]"
                        }
                    />
                ))}
                <Ring size={valueSize} fill={`${color}14`} className="border-[1.5px]">
                    <div className="absolute -inset-px motion-safe:animate-[spin_12s_linear_infinite]">
                        <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
                    </div>
                </Ring>
                <span className="absolute h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
            </motion.div>
        </div>
    );
};

function tug(distance: number): number {
    return Math.sign(distance) * decay(Math.abs(distance), MAX_TUG);
}

function decay(value: number, max: number): number {
    if (max === 0) {
        return 0;
    }
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}

export default RadiusDial;
