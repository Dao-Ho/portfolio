import Link from "next/link";
import type { ReactNode } from "react";

const isExternal = (href: string) => /^https?:/.test(href);

/** A link inside running prose; outside links open in a new tab. */
export default function InlineLink({ href, children }: { href: string; children: ReactNode }) {
    if (!isExternal(href)) {
        return (
            <Link href={href} className="ink-link">
                {children}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="ink-link">
            {children}
        </a>
    );
}
