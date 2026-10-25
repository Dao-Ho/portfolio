/** A circle half filled in, the usual contrast mark; it turns a half-turn when the theme switches. */
export default function ThemeIcon({ isLight, size }: { isLight: boolean; size: number | string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            width={size}
            height={size}
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
            style={{ transform: `rotate(${isLight ? 0 : 180}deg)` }}
        >
            <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
            <path d="M8 1.75a6.25 6.25 0 0 0 0 12.5z" fill="currentColor" />
        </svg>
    );
}
