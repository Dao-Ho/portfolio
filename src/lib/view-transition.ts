import { flushSync } from "react-dom";

let finish: (() => void) | null = null;

/**
 * Navigates inside a view transition. `direction` is set on <html> as `data-transition` while it plays, so the CSS can
 * slide forward into a page or back out of it.
 */
export function pushWithTransition(
    router: { push: (href: string) => void },
    href: string,
    direction: "forward" | "back" = "forward"
) {
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
    }
    const root = document.documentElement;
    root.dataset.transition = direction;
    const transition = document.startViewTransition(
        () =>
            new Promise<void>((resolve) => {
                finish = resolve;
                router.push(href);
                // The old page stays frozen until this resolves, so don't wait forever on a slow load.
                setTimeout(resolve, 1500);
            })
    );
    transition.finished.finally(() => delete root.dataset.transition);
}

/** True while a page is rendering as the destination of `pushWithTransition`. */
export const isTransitioning = () => finish !== null;

/** Called by the destination page once it has rendered, which lets the transition play. */
export function finishTransition() {
    finish?.();
    finish = null;
}

let revealing = false;

/**
 * Switches the theme inside a view transition, revealing the new one as a circle spreading out from (x, y). Presses
 * while a reveal is still playing are ignored.
 */
export function switchThemeWithReveal(toggle: () => void, x: number, y: number) {
    if (revealing) return;
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        toggle();
        return;
    }
    revealing = true;
    const root = document.documentElement;
    // Big enough to reach the farthest corner of the window.
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.style.setProperty("--reveal-x", `${x}px`);
    root.style.setProperty("--reveal-y", `${y}px`);
    root.style.setProperty("--reveal-r", `${radius}px`);
    root.dataset.transition = "theme";
    // The new theme has to be on screen before the callback returns, so React renders it right away.
    const transition = document.startViewTransition(() => flushSync(toggle));
    transition.finished.finally(() => {
        delete root.dataset.transition;
        revealing = false;
    });
}
