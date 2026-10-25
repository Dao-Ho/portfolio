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
