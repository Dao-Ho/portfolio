import { MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { SunIcon } from "@phosphor-icons/react/dist/csr/Sun";

/** The theme toggle's mark: a moon to switch to dark, a sun to switch to light, in Phosphor's bold weight. */
export default function ThemeIcon({ size }: { size: number | string }) {
    // Both render and CSS picks one, so the server and client markup match before the theme is known.
    return (
        <>
            <MoonIcon size={size} weight="bold" aria-hidden className="dark:hidden" />
            <SunIcon size={size} weight="bold" aria-hidden className="hidden dark:inline" />
        </>
    );
}
