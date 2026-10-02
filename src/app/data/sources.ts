/**
 * Sources for the landing page's @-mentions.
 *
 * A mention points at its source rather than reproducing it, so these carry
 * only what the hover chip shows — a role and a one-line summary — plus where
 * a click lands. The substance stays in the experience list (by entry name) or on
 * another page of the site (by href).
 */

export type Source = {
    key: string;
    /** Shown beside the mark in the card header. */
    name: string;
    /**
     * Optical size correction, default 1. A circular plate covers ~79% of the
     * area a square one does, so it reads small at the same dimensions.
     */
    iconScale?: number;
    /** Vendored favicon in /public/logos. Omit and the card falls back to a monogram. */
    icon?: string;
    /** Prominent line in the card — the title slot. */
    role: string;
    /** Leads the body line, the way a publication date does in a real citation. */
    dates: string;
    /** One line on the work itself. */
    summary: string;
    /** companyName of the matching experience entry, for an in-page jump.
     *  Keyed by name rather than array index so reordering or removing an
     *  entry can't silently point a mention at the wrong company. */
    entry?: string;
    /** In-app path (or external URL) for a source that lives on its own page. */
    href?: string;
};

export const SOURCES: Record<string, Source> = {
    generate: {
        key: "generate",
        name: "Generate",
        icon: "/logos/generate.png",
        iconScale: 1.16,
        role: "Chief of Software",
        dates: "Sept 2024–Present",
        summary: "Student development studio.",
        href: "https://generatenu.com/",
    },
    parcs: {
        key: "parcs",
        name: "PARCS Lab",
        icon: "/logos/parcs.png",
        iconScale: 1.16,
        role: "Research Assistant",
        dates: "Sept 2026–Present",
        summary: "LLM research.",
        href: "https://parcslab.fyi/",
    },
    google: {
        key: "google",
        name: "Google",
        icon: "/logos/google.png",
        iconScale: 1.16,
        role: "Software Engineer Intern",
        dates: "May–Aug 2026",
        summary: "Citation and evaluation infrastructure for Gemini.",
        entry: "Google",
    },
    googleIncoming: {
        key: "googleIncoming",
        name: "Google",
        icon: "/logos/google.png",
        iconScale: 1.16,
        role: "Software Engineer",
        dates: "Starting Jan 2027",
        summary: "Shopping on Gemini.",
        href: "https://gemini.google.com/",
    },
    agency: {
        key: "agency",
        name: "Agency (Acquired by Klaviyo)",
        icon: "/logos/agency.png",
        role: "Member of Technical Staff",
        dates: "May–Dec 2025",
        summary: "Shipped to production daily. Tracer bullets, velocity, and what it takes to scale them.",
        entry: "Agency",
    },
    designai: {
        key: "designai",
        name: "DesignAI",
        icon: "/logos/designai.png",
        role: "Software Engineer Intern",
        dates: "Sept 2024–Jan 2025",
        summary: "An image platform interior designers search, organize, and work out of.",
        entry: "DesignAI",
    },
    paynalli: {
        key: "paynalli",
        name: "Paynalli Systems",
        icon: "/logos/paynalli.png",
        role: "Software Engineer Intern",
        dates: "July–Sept 2024",
        summary: "RAG search over embeddings and vector stores for recruiter–candidate matching.",
        entry: "Paynalli Systems",
    },
    khoury: {
        key: "khoury",
        name: "Khoury College",
        icon: "/logos/khoury.png",
        role: "Discrete Math Teaching Assistant",
        dates: "Sept 2023–May 2024",
        summary: "Took the course while in high school, TA'd first semester of college.",
        entry: "Northeastern University",
    },
    paint: {
        key: "paint",
        name: "Gallery",
        role: "Best in Show, Baltimore Museum of Art",
        dates: "2022–2023",
        summary: "Seven watercolours.",
        href: "/gallery",
    },
};

/** Shared id scheme for the experience scroll targets. */
export const entrySlug = (companyName: string) => companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
