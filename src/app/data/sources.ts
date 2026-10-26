/** Sources for the landing page's @-mentions: what the hover card shows, plus where a click lands. */

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
    /** Where a click lands: an in-app path or an external URL. */
    href?: string;
    /** Keys of other sources this one rolls up; the card lists each of them instead of one role. */
    group?: string[];
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
        href: "https://gemini.google.com/",
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
        role: "Member of Technical Staff Co-op",
        dates: "May–Dec 2025",
        summary: "Shipped to production daily. Tracer bullets, velocity, and what it takes to scale them.",
        href: "https://www.agency.inc/",
    },
    designai: {
        key: "designai",
        name: "DesignAI",
        icon: "/logos/designai.png",
        role: "Software Engineer Intern",
        dates: "Sept 2024–Jan 2025",
        summary: "An image platform interior designers search, organize, and work out of.",
        href: "https://www.designai.co/",
    },
    paynalli: {
        key: "paynalli",
        name: "Paynalli Systems",
        icon: "/logos/paynalli.png",
        role: "Software Engineer Intern",
        dates: "July–Sept 2024",
        summary: "RAG search over embeddings and vector stores for recruiter–candidate matching.",
        href: "https://paynalli.com/",
    },
    startups: {
        key: "startups",
        name: "Early-stage startups",
        role: "DesignAI and Paynalli",
        dates: "2024–2025",
        summary: "Two early-stage startup internships.",
        group: ["designai", "paynalli"],
    },
    khoury: {
        key: "khoury",
        name: "Khoury College",
        icon: "/logos/khoury.png",
        role: "Discrete Math Teaching Assistant",
        dates: "Sept 2023–May 2024",
        summary: "Took the course while in high school, TA'd first semester of college.",
        href: "https://www.khoury.northeastern.edu/home/aloupis/discrete-math/resources.html",
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
