"use client";

import React, { useState, useRef } from "react";
import { Download } from "lucide-react";

interface GeneratorProps {
    isLight: boolean;
}

interface LogoMapConfig {
    gridWidth: number;
    gridHeight: number;
    dotPositions: boolean[][];
    spacing: number;
    colors?: string[][];
}

const LogoMapGenerator: React.FC<GeneratorProps> = ({ isLight }) => {
    const [config, setConfig] = useState<LogoMapConfig | null>(null);
    const [processing, setProcessing] = useState(false);
    const [gridSize, setGridSize] = useState(40);
    const [threshold, setThreshold] = useState(128);
    const [spacing, setSpacing] = useState(2);
    const [gradientColors, setGradientColors] = useState<string[]>(["#3c7cff", "#ec4899"]);
    const [gradientInput, setGradientInput] = useState("#3c7cff, #ec4899");
    const [useImageColors, setUseImageColors] = useState(false); // New toggle
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const processImage = (img: HTMLImageElement, gridSize: number, threshold: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return null;

        const aspectRatio = img.height / img.width;
        const gridHeight = Math.floor(gridSize * aspectRatio);

        canvas.width = gridSize;
        canvas.height = gridHeight;
        ctx.drawImage(img, 0, 0, gridSize, gridHeight);

        const imageData = ctx.getImageData(0, 0, gridSize, gridHeight);
        const pixels = imageData.data;

        const interpolateColor = (color1: string, color2: string, factor: number): string => {
            const c1 = hexToRgb(color1);
            const c2 = hexToRgb(color2);

            const r = Math.round(c1.r + (c2.r - c1.r) * factor);
            const g = Math.round(c1.g + (c2.g - c1.g) * factor);
            const b = Math.round(c1.b + (c2.b - c1.b) * factor);

            return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        };

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                  }
                : { r: 0, g: 0, b: 0 };
        };

        const getGradientColorByPosition = (x: number, width: number): string => {
            if (gradientColors.length === 0) return "#3c7cff";
            if (gradientColors.length === 1) return gradientColors[0];

            const positionProgress = x / width;
            const scaledProgress = positionProgress * (gradientColors.length - 1);
            const index = Math.floor(scaledProgress);
            const nextIndex = Math.min(index + 1, gradientColors.length - 1);
            const localProgress = scaledProgress - index;

            return interpolateColor(gradientColors[index], gradientColors[nextIndex], localProgress);
        };

        const dotPositions: boolean[][] = [];
        const colors: string[][] = [];

        for (let y = 0; y < gridHeight; y++) {
            const row: boolean[] = [];
            const colorRow: string[] = [];

            for (let x = 0; x < gridSize; x++) {
                const index = (y * gridSize + x) * 4;
                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];
                const a = pixels[index + 3];
                const brightness = (r + g + b) / 3;

                // When using image colors, include ALL pixels (including light ones)
                // When using gradient, only include dark pixels
                const isLogo = useImageColors
                    ? a >= 128 // Include all opaque pixels
                    : a >= 128 && brightness <= threshold; // Only dark pixels

                row.push(isLogo);

                // Use actual image color or gradient color
                let color = "";
                if (isLogo) {
                    if (useImageColors) {
                        // Extract actual color from image
                        color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
                    } else {
                        // Use gradient
                        color = getGradientColorByPosition(x, gridSize);
                    }
                }
                colorRow.push(color);
            }

            dotPositions.push(row);
            colors.push(colorRow);
        }

        return {
            gridWidth: gridSize,
            gridHeight,
            dotPositions,
            spacing: 2,
            colors,
        };
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setProcessing(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                imageRef.current = img;
                const result = processImage(img, gridSize, threshold);
                if (result) {
                    setConfig(result);
                }
                setProcessing(false);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleGridSizeChange = (value: number) => {
        setGridSize(value);
        if (imageRef.current) {
            const result = processImage(imageRef.current, value, threshold);
            if (result) {
                setConfig({ ...result, spacing });
            }
        }
    };

    const handleThresholdChange = (value: number) => {
        setThreshold(value);
        if (imageRef.current) {
            const result = processImage(imageRef.current, gridSize, value);
            if (result) {
                setConfig({ ...result, spacing });
            }
        }
    };

    const handleSpacingChange = (value: number) => {
        setSpacing(value);
        if (config) {
            setConfig({ ...config, spacing: value });
        }
    };

    const handleGradientChange = (value: string) => {
        setGradientInput(value);
        const colors = value
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c);
        setGradientColors(colors);

        if (imageRef.current && colors.length > 0) {
            const result = processImage(imageRef.current, gridSize, threshold);
            if (result) {
                setConfig({ ...result, spacing });
            }
        }
    };

    const handleUseImageColorsChange = (checked: boolean) => {
        setUseImageColors(checked);
        if (imageRef.current) {
            const result = processImage(imageRef.current, gridSize, threshold);
            if (result) {
                setConfig({ ...result, spacing });
            }
        }
    };

    const downloadConfig = () => {
        if (!config) return;

        const jsonString = JSON.stringify(config, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "logo-map.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        if (!config) return;

        const code = `// Generated logo map configuration
export const logoMap = ${JSON.stringify(config, null, 2)};`;

        navigator.clipboard.writeText(code);
        alert("Configuration copied to clipboard!");
    };

    const dotCount = config ? config.dotPositions.flat().filter((d) => d).length : 0;

    return (
        <div className="flex flex-col gap-6 p-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className={`text-3xl font-light ${isLight ? "text-gray-900" : "text-gray-100"}`}>
                    Logo Map Generator
                </h1>
                <p className={`text-sm font-light opacity-70 ${isLight ? "text-gray-800" : "text-gray-200"}`}>
                    Generate a static configuration file for your logo that can be reused without image processing
                </p>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="flex flex-col gap-4">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processing}
                    className={`px-6 py-3 rounded-lg font-light transition-colors ${
                        isLight
                            ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                    } ${processing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    {processing ? "Processing..." : "Upload Logo Image"}
                </button>

                {config && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <label className={`text-sm font-light ${isLight ? "text-gray-900" : "text-gray-100"}`}>
                                Grid Size (width): {gridSize} dots
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="120"
                                value={gridSize}
                                onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className={`text-sm font-light ${isLight ? "text-gray-900" : "text-gray-100"}`}>
                                Threshold (darkness): {threshold}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="255"
                                value={threshold}
                                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                                className="w-full"
                            />
                            <p className={`text-xs opacity-70 ${isLight ? "text-gray-800" : "text-gray-200"}`}>
                                Lower = more dots, Higher = fewer dots
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className={`text-sm font-light ${isLight ? "text-gray-900" : "text-gray-100"}`}>
                                Spacing: {spacing}x
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.5"
                                value={spacing}
                                onChange={(e) => handleSpacingChange(Number(e.target.value))}
                                className="w-full"
                            />
                            <p className={`text-xs opacity-70 ${isLight ? "text-gray-800" : "text-gray-200"}`}>
                                Lower = dense/tight, Higher = sparse/spread out
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="useImageColors"
                                checked={useImageColors}
                                onChange={(e) => handleUseImageColorsChange(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label
                                htmlFor="useImageColors"
                                className={`text-sm font-light ${isLight ? "text-gray-900" : "text-gray-100"}`}
                            >
                                Use actual colors from logo image
                            </label>
                        </div>

                        {!useImageColors && (
                            <div className="flex flex-col gap-3">
                                <label className={`text-sm font-light ${isLight ? "text-gray-900" : "text-gray-100"}`}>
                                    Gradient Colors (comma-separated hex codes)
                                </label>
                                <input
                                    type="text"
                                    value={gradientInput}
                                    onChange={(e) => handleGradientChange(e.target.value)}
                                    placeholder="#3c7cff, #ec4899"
                                    className={`px-3 py-2 rounded-lg border ${
                                        isLight
                                            ? "bg-white border-gray-300 text-gray-900"
                                            : "bg-gray-800 border-gray-600 text-gray-100"
                                    }`}
                                />
                                <p className={`text-xs opacity-70 ${isLight ? "text-gray-800" : "text-gray-200"}`}>
                                    Example: #34181c, #1f0f15, #010002
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {config && (
                    <div className="flex flex-col gap-4 p-6 rounded-lg border border-gray-300">
                        <div className="flex flex-col gap-2">
                            <h2 className={`text-xl font-light ${isLight ? "text-gray-900" : "text-gray-100"}`}>
                                Generated Configuration
                            </h2>
                            <div
                                className={`text-sm font-light opacity-70 ${isLight ? "text-gray-800" : "text-gray-200"}`}
                            >
                                <p>
                                    Grid Size: {config.gridWidth} × {config.gridHeight}
                                </p>
                                <p>Total Dots: {dotCount}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={downloadConfig}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-light transition-colors ${
                                    isLight
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            >
                                <Download size={16} />
                                Download JSON
                            </button>

                            <button
                                onClick={copyToClipboard}
                                className={`px-4 py-2 rounded-lg font-light transition-colors ${
                                    isLight
                                        ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                                        : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                                }`}
                            >
                                Copy as JS
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className={`text-lg font-light ${isLight ? "text-gray-900" : "text-gray-100"}`}>
                                Preview
                            </h3>
                            <div
                                className="inline-block p-4 rounded-lg"
                                style={{
                                    backgroundColor: isLight ? "#f5f5f5" : "#1a1a1a",
                                }}
                            >
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: `repeat(${config.gridWidth}, 4px)`,
                                        gap: `${4 * config.spacing * 0.5}px`,
                                    }}
                                >
                                    {config.dotPositions.map((row, y) =>
                                        row.map((isDot, x) => (
                                            <div
                                                key={`${x}-${y}`}
                                                className="rounded-full"
                                                style={{
                                                    width: "4px",
                                                    height: "4px",
                                                    backgroundColor: isDot
                                                        ? config.colors?.[y]?.[x] || (isLight ? "#262523" : "#cbd0d2")
                                                        : "transparent",
                                                }}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg font-mono text-xs ${isLight ? "bg-gray-100" : "bg-gray-800"}`}>
                            <pre className="overflow-x-auto">
                                {`// Usage in your component:
import logoMap from './logo-map.json';

<InteractiveLogoDots 
  logoMap={logoMap}
  isLight={isLight}
  dotSize={4}
/>`}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogoMapGenerator;
