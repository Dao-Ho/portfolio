export type Project = {
    /** URL segment for the project's own page. */
    slug: string;
    index: string;
    name: string;
    description: string;
    tech: string[];
    year: string;
    /** Omit to show the project without sending anyone anywhere. */
    link?: string;
    /** Small raster preview, rendered from the original artwork. */
    thumb: string;
    /** A project with its own page on the site; its tiles link there instead of out. */
    page?: {
        tagline: string;
        /** The write-up under the tagline, so the page doesn't repeat it. */
        about: string;
        video: string;
        poster: string;
        /** Wide banner across the top of the page, like a Notion cover. */
        cover?: string;
        /** 1200×630 card for link previews when the page is shared. */
        share?: string;
        /** How the project got here, as prose with the clips placed between paragraphs. */
        story?: StoryBlock[];
    };
};

/** A paragraph is plain text with inline links; a clip is a short muted video. */
export type StoryBlock =
    | { kind: "heading"; text: string }
    | { kind: "text"; parts: (string | { text: string; href: string })[] }
    | { kind: "clip"; src: string; poster?: string; label: string }
    | { kind: "image"; src: string; alt: string; width: number; height: number }
    /** `start` is the panel open before anyone interacts; lead with the strongest shot. */
    | { kind: "gallery"; title?: string; shots: Shot[]; start?: number };

/** A captioned still of the product, shown on its own or in a gallery grid. */
export type Shot = {
    /** Tight crop of the UI, for the swipeable cards on small screens. */
    src: string;
    /** The full 16:9 frame, for the accordion panels on desktop. */
    frame: string;
    alt: string;
    title: string;
    caption: string;
    width: number;
    height: number;
};

export const projects: Project[] = [
    {
        index: "01",
        slug: "selfserve",
        name: "Selfserve",
        description:
            "Jira for hotel operations. Designed and shipped an internal platform that gives hotel staff a self-serve dashboard to manage tasks, track requests, and streamline day-to-day operations.",
        tech: ["Next.js", "TypeScript", "Go"],
        year: "Spring 2026",
        link: "https://github.com/GenerateNU/selfserve",
        thumb: "/projects/selfserve/selfserve-thumb.webp",
    },
    {
        index: "02",
        slug: "dynami",
        name: "Dynami",
        description:
            "A developer's Dynamic Island for the Mac notch. Agent permission prompts, pull request reviews and your calendar, glanceable and actionable without leaving what you're working on.",
        tech: ["Swift", "SwiftUI", "GitHub API"],
        year: "Spring 2026",
        thumb: "/projects/dynami/dynami-cover.webp",
        page: {
            tagline: "The Dynamic Island, for developers.",
            about: "Dynami lives in your Mac's notch and keeps the things that need your attention within reach while you work, from agent permission prompts and pull request activity to the next meeting on your calendar.",
            video: "/projects/dynami/dynami-demo.mp4",
            poster: "/projects/dynami/dynami-demo-poster.webp",
            cover: "/projects/dynami/dynami-header.webp",
            share: "/projects/dynami/dynami-og.png",
            story: [
                { kind: "heading", text: "Waiting on other people" },
                {
                    kind: "text",
                    parts: [
                        "On a team that ships quickly, much of the day is spent waiting on other people, whether for a review, an approval, or a second look at changes you thought were finished. I found myself refreshing GitHub to see whether anything had moved, and Dynami began as a way to let that information come to me instead.",
                    ],
                },
                { kind: "heading", text: "Pull requests in the notch" },
                {
                    kind: "text",
                    parts: [
                        "The first version, which I ",
                        { text: "shared on X", href: "https://x.com/daoho04/status/2035301956953018718" },
                        ", was deliberately narrow. It watched my pull requests and, whenever one was approved, received requested changes, or needed my review, expanded the notch to show the title, repository, and status.",
                    ],
                },
                {
                    kind: "clip",
                    src: "/projects/dynami/dynami-v1.mp4",
                    poster: "/projects/dynami/dynami-v1-poster.webp",
                    label: "v1, pull request notifications",
                },
                { kind: "heading", text: "Deploys, from a reply" },
                {
                    kind: "text",
                    parts: [
                        "Later that day, ",
                        {
                            text: "one of the replies to that post",
                            href: "https://x.com/Neesh774/status/2035493090534768663",
                        },
                        " came from Neesh, who asked for Vercel deployments going live or failing after a commit. The request was a no brainer, since once code is pushed, whether it deployed is usually the question that matters most. I ",
                        {
                            text: "shipped deployment tracking two days later",
                            href: "https://x.com/daoho04/status/2036120047668609232",
                        },
                        ", and a failed preview build now appears in the notch before I would think to check for it.",
                    ],
                },
                {
                    kind: "clip",
                    src: "/projects/dynami/dynami-v2.mp4",
                    poster: "/projects/dynami/dynami-v2-poster.webp",
                    label: "v2, a failed preview deploy",
                },
                { kind: "heading", text: "A small workspace" },
                {
                    kind: "text",
                    parts: [
                        "Since then, Dynami has grown from a notification into a small workspace. Coding agents such as Claude pause to request permission before running commands, so that prompt now appears in the notch, where I can approve or deny it without leaving the editor. GitHub has a dedicated tab, and Home holds my calendar and what's currently playing.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "In the notch",
                    start: 2,
                    shots: [
                        {
                            src: "/projects/dynami/notch-collapsed-crop.webp",
                            frame: "/projects/dynami/notch-collapsed-frame.webp",
                            width: 1160,
                            height: 420,
                            alt: "Dynami collapsed into a small pill around the MacBook notch, with a green dot on the left and a music waveform on the right",
                            title: "At rest",
                            caption:
                                "A small pill around the notch. The green dot means a Claude session finished, and the waveform means music is playing.",
                        },
                        {
                            src: "/projects/dynami/notch-pr-alert-crop.webp",
                            frame: "/projects/dynami/notch-pr-alert-frame.webp",
                            width: 1160,
                            height: 420,
                            alt: "An alert under the notch for pull request 58, feat: swipeable day slider with drift, approved by Sam Rivera",
                            title: "PR alert",
                            caption:
                                "The same alert as the first version, now showing the reviewer and the outcome at a glance.",
                        },
                        {
                            src: "/projects/dynami/notch-claude-prompt-crop.webp",
                            frame: "/projects/dynami/notch-claude-prompt-frame.webp",
                            width: 1160,
                            height: 420,
                            alt: "A permission prompt under the notch reading dynami wants to use Bash, git push origin feat/day-slider, with Deny and Allow buttons",
                            title: "Permission prompt",
                            caption: "Deny or Allow here answers Claude Code directly.",
                        },
                    ],
                },
                {
                    kind: "gallery",
                    title: "The panel",
                    shots: [
                        {
                            src: "/projects/dynami/notch-home-tab-crop.webp",
                            frame: "/projects/dynami/notch-home-tab-frame.webp",
                            width: 1200,
                            height: 550,
                            alt: "The Dynami panel on the Home tab, with Glitter by 070 Shake playing next to a calendar showing Friday the 23rd",
                            title: "Home",
                            caption: "What's playing next to the calendar, with a day slider and a Today button.",
                        },
                        {
                            src: "/projects/dynami/notch-github-tab-crop.webp",
                            frame: "/projects/dynami/notch-github-tab-frame.webp",
                            width: 1200,
                            height: 550,
                            alt: "The Dynami panel on the GitHub tab, listing pull request 58 approved, 61 with a review requested, and 55 with failing checks",
                            title: "GitHub",
                            caption:
                                "My pull requests and review requests. The count turns red when something needs attention.",
                        },
                        {
                            src: "/projects/dynami/notch-claude-tab-crop.webp",
                            frame: "/projects/dynami/notch-claude-tab-frame.webp",
                            width: 1200,
                            height: 550,
                            alt: "The Dynami panel on the Claude tab, listing the dynami session running git push and the portfolio session finished",
                            title: "Agent",
                            caption: "Live sessions and what each one is doing.",
                        },
                    ],
                },
            ],
        },
    },
    {
        index: "03",
        slug: "vetruly",
        name: "Vetruly",
        description:
            "Full-stack platform connecting pet owners with vetted care providers. Led a team of 5 engineers from concept to production.",
        tech: ["Next.js", "TypeScript", "PostgreSQL"],
        year: "Spring 2025",
        link: "https://www.vetruly.com/",
        thumb: "/projects/vetruly/vetruly-thumb.webp",
    },
    {
        index: "04",
        slug: "three-stones",
        name: "Three Stones",
        description:
            "Mobile application allowing retail investors to crowdfund real estate projects. Built authentication and core user flows end-to-end.",
        tech: ["React Native", "Go", "AWS"],
        year: "Fall 2024",
        link: "https://generatenu.com/",
        thumb: "/projects/3-stones/3-stones-thumb.webp",
    },
];

/** Where a project's tile or button leads: its own page, its outside link, or nowhere. */
export const projectHref = (p: Project) => (p.page ? `/projects/${p.slug}` : p.link);

export const isExternal = (href: string) => /^https?:/.test(href);
