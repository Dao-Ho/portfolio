import { MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { SunIcon } from "@phosphor-icons/react/dist/csr/Sun";

/** The theme toggle's mark: a moon to switch to dark, a sun to switch to light, in Phosphor's bold weight. */
export default function ThemeIcon({ isLight, size }: { isLight: boolean; size: number | string }) {
    return isLight ? (
        <MoonIcon size={size} weight="bold" aria-hidden />
    ) : (
        <SunIcon size={size} weight="bold" aria-hidden />
    );
}
