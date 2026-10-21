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
        about: Prose;
        /** Omit for a project without a demo; the poster then stands alone as the lead image. */
        video?: string;
        poster: string;
        /** Wide banner across the top of the page, like a Notion cover. */
        cover?: string;
        /** 1200×630 card for link previews when the page is shared. */
        share?: string;
        /** How the project got here, as prose with the clips placed between paragraphs. */
        story?: StoryBlock[];
    };
};

/** Plain text with inline links. */
export type Prose = (string | { text: string; href: string })[];

/** A paragraph is plain text with inline links; a clip is a short muted video. */
export type StoryBlock =
    | { kind: "heading"; text: string }
    | { kind: "text"; parts: Prose }
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
        thumb: "/projects/selfserve/selfserve-preview.webp",
        page: {
            tagline: "Jira for hotel operations.",
            about: [
                { text: "SelfServe", href: "https://www.selfserve.tech/" },
                " is a VC-backed startup that already had a client-facing app working with hotels. They came to ",
                { text: "Generate Product Development", href: "https://generatenu.com/" },
                " to build the hotel side from 0 to 1, an MVP that streamlines day-to-day operations for hotel staff. As a technical lead at Generate, I led the team of 6 engineers.",
            ],
            poster: "/projects/selfserve/selfserve-hero.webp",
            cover: "/projects/selfserve/selfserve-header.webp",
            share: "/projects/selfserve/selfserve-og.png",
            story: [
                { kind: "heading", text: "One board for the entire property" },
                {
                    kind: "text",
                    parts: [
                        "Every task in the hotel lives on one board, organized by department or by team member. New work can be written in plain language; the assistant interprets it and fills in the details.",
                    ],
                },
                {
                    kind: "text",
                    parts: [
                        "Views that follow you. Inspired by Linear, saved views keep each person's sorting and filters, stay the same across pages, and are there the next time they log in.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Web",
                    shots: [
                        {
                            src: "/projects/selfserve/board.webp",
                            frame: "/projects/selfserve/board.webp",
                            width: 1600,
                            height: 900,
                            alt: "The SelfServe home board with columns for Food & Beverage, Maintenance, Room Flipping and Front Desk, and a Restock bar inventory card lifted out",
                            title: "Home",
                            caption:
                                "Every open task by department, with the deadline, assignees and location on each card.",
                        },
                        {
                            src: "/projects/selfserve/ai-web.webp",
                            frame: "/projects/selfserve/ai-web.webp",
                            width: 1600,
                            height: 900,
                            alt: "A request to the assistant to restock bar inventory in the lobby by 2pm for Rohan and Jolin, next to the task it filled in",
                            title: "Task creation",
                            caption:
                                "Describe a task in a sentence, then review the assignees, deadline, priority and department before saving.",
                        },
                        {
                            src: "/projects/selfserve/rooms-web.webp",
                            frame: "/projects/selfserve/rooms-web.webp",
                            width: 1600,
                            height: 900,
                            alt: "The Rooms page listing Room 100 with tags like High Priority, Needs Cleaning and Late Checkout, and a side panel of its open guest issues",
                            title: "Rooms",
                            caption: "Each room's status at a glance, with open issues to resolve from the side panel.",
                        },
                    ],
                },
                { kind: "heading", text: "On the floor" },
                {
                    kind: "text",
                    parts: [
                        "Staff carry the same tasks on their phones. They pick up unassigned work, mark it done, and look up a room or a guest's needs.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Mobile",
                    shots: [
                        {
                            src: "/projects/selfserve/tasks-mobile.webp",
                            frame: "/projects/selfserve/tasks-mobile.webp",
                            width: 1600,
                            height: 900,
                            alt: "Three phones showing My Tasks, the Clean Up Spill task with a Mark as Done button, and a Task completed toast",
                            title: "Tasks",
                            caption: "My tasks and unassigned tasks, each a tap away from done.",
                        },
                        {
                            src: "/projects/selfserve/ai-mobile.webp",
                            frame: "/projects/selfserve/ai-mobile.webp",
                            width: 1600,
                            height: 900,
                            alt: "Task creation on a phone, where a request for high priority steam towels on floor 4 becomes a suggested task with a deadline, recurrence and department",
                            title: "Task creation",
                            caption: "The same assistant on mobile, with the suggested task to edit before confirming.",
                        },
                        {
                            src: "/projects/selfserve/rooms-mobile.webp",
                            frame: "/projects/selfserve/rooms-mobile.webp",
                            width: 1600,
                            height: 900,
                            alt: "Phones showing the rooms on Floor 1, Room 100's issues and tasks, and Lucy's guest profile with her Suite 401 booking and needs like wheelchair access and a peanut allergy",
                            title: "Rooms and guests",
                            caption:
                                "Rooms by floor, and guest profiles with bookings and needs like accessibility or allergies.",
                        },
                    ],
                },
            ],
        },
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
            about: [
                "Dynami lives in your Mac's notch and keeps the things that need your attention within reach while you work, from agent permission prompts and pull request activity to the next meeting on your calendar.",
            ],
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
        thumb: "/projects/vetruly/vetruly-preview.webp",
        page: {
            tagline: "Trusted vet care for recovering and medically complex pets.",
            about: [
                "Vetruly helps owners of pets recovering from surgery or living with complex conditions find vetted providers for post-op care, integrative care, specialty boarding and drop-in visits. ",
                { text: "Katlyn", href: "https://www.vetruly.com/about" },
                " brought the idea to ",
                { text: "Generate Product Development", href: "https://generatenu.com/" },
                ", and we built it from 0 to 1 as an MVP. I led the team of 5 engineers, and it's now a deployed product with pet owners and licensed providers using it.",
            ],
            poster: "/projects/vetruly/vetruly-hero.webp",
            cover: "/projects/vetruly/vetruly-header.webp",
            share: "/projects/vetruly/vetruly-og.png",
            story: [
                { kind: "heading", text: "Finding care" },
                {
                    kind: "text",
                    parts: [
                        "Owners search a map for providers nearby, filtered by the kind of care their pet needs, then pick a time from the provider's profile.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "For owners",
                    start: 1,
                    shots: [
                        {
                            src: "/projects/vetruly/welcome-crop.webp",
                            frame: "/projects/vetruly/welcome-frame.webp",
                            width: 1200,
                            height: 692,
                            alt: "The Vetruly sign-in screen, a line drawing of a dog on a rust panel next to a Welcome to Vetruly form with email, Google and Microsoft options",
                            title: "Welcome",
                            caption: "Sign in with email, Google or Microsoft. Vets and vet techs join as providers.",
                        },
                        {
                            src: "/projects/vetruly/explore-crop.webp",
                            frame: "/projects/vetruly/explore-frame.webp",
                            width: 1200,
                            height: 692,
                            alt: "A map of Boston with vets pinned on it, a search for post-operative care, and a card for Dr. Elizabeth Ulma with her rating, care types and price",
                            title: "Explore providers",
                            caption:
                                "Providers on a map, filtered by post-op care, integrative care, specialty boarding or drop-ins.",
                        },
                        {
                            src: "/projects/vetruly/profile-crop.webp",
                            frame: "/projects/vetruly/profile-frame.webp",
                            width: 1200,
                            height: 692,
                            alt: "Dr. Elizabeth Ulma's profile, with a verified MA license badge, her clinic's location, upcoming availability and a Book appointment button",
                            title: "Vet profile",
                            caption:
                                "A verified license, the clinic, and the week's availability next to the booking button.",
                        },
                        {
                            src: "/projects/vetruly/date-crop.webp",
                            frame: "/projects/vetruly/date-frame.webp",
                            width: 1200,
                            height: 692,
                            alt: "Step 3 of 7 of booking, a March 2025 calendar with the 14th selected and a column of open times with 2:00 PM chosen",
                            title: "Choose a date",
                            caption: "Booking is a short series of steps, with open times listed beside the calendar.",
                        },
                    ],
                },
                { kind: "heading", text: "After booking" },
                {
                    kind: "text",
                    parts: [
                        "Both sides get a careboard. Owners keep each provider's messages and visit details in one thread, and providers accept or decline requests next to their inbox.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Careboards",
                    shots: [
                        {
                            src: "/projects/vetruly/owner-crop.webp",
                            frame: "/projects/vetruly/owner-frame.webp",
                            width: 1200,
                            height: 692,
                            alt: "Anna's Careboard, listing three vets on the left and a thread with Dr. Ulma showing an approved post-op home visit for Bruce",
                            title: "Owner",
                            caption:
                                "Every provider an owner has booked, with the visit, files and replies in one thread.",
                        },
                        {
                            src: "/projects/vetruly/provider-crop.webp",
                            frame: "/projects/vetruly/provider-frame.webp",
                            width: 1200,
                            height: 692,
                            alt: "Dr. Ulma's careboard, with her ratings and experience, three pending bookings to accept or decline, and a column of messages from owners",
                            title: "Provider",
                            caption:
                                "Pending requests to accept or decline, with unread messages from owners alongside.",
                        },
                    ],
                },
            ],
        },
    },
    {
        index: "04",
        slug: "three-stones",
        name: "Three Stones",
        description:
            "Mobile app where everyday investors crowdfund real estate projects. Built sign-in, the home screen and search on a team of 5 engineers.",
        tech: ["React Native", "Go", "Supabase"],
        year: "Fall 2024",
        link: "https://github.com/GenerateNU/3stones",
        thumb: "/projects/3-stones/3-stones-preview.webp",
        page: {
            tagline: "Real estate crowdfunding for everyday investors.",
            about: [
                "3 Stones is a mobile app where real estate developers raise money for their projects from everyday investors. Investors browse listings, put in small amounts, and build a portfolio that pays out when a property sells. It was a ",
                { text: "Generate Product Development", href: "https://generatenu.com/" },
                " project and one of my first full-stack projects, which made it a big learning experience. I was one of 5 software engineers working with 2 technical leads, and as an individual contributor I built sign-in, the home screen and search.",
            ],
            poster: "/projects/3-stones/3-stones-hero.webp",
            cover: "/projects/3-stones/3-stones-header.webp",
            share: "/projects/3-stones/3-stones-og.png",
            story: [
                { kind: "heading", text: "What I built" },
                {
                    kind: "text",
                    parts: [
                        "I built sign-in, the home screen and search, from the screens down to the backend. Home is the first thing investors see, with their portfolio value and how each investment is doing. Search is how they find new projects from the Explore tab.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "My flows",
                    shots: [
                        {
                            src: "/projects/3-stones/discover-crop.webp",
                            frame: "/projects/3-stones/discover-frame.webp",
                            width: 1200,
                            height: 749,
                            alt: "Three phones showing the Explore tab with recommended and popular projects, search results for commercial development, and the project page for 931 1st Street",
                            title: "Search",
                            caption:
                                "Explore, then search results with the expected return and timeline for each project.",
                        },
                        {
                            src: "/projects/3-stones/portfolio-crop.webp",
                            frame: "/projects/3-stones/portfolio-frame.webp",
                            width: 1200,
                            height: 749,
                            alt: "The home screen welcoming Michael back with a $12,345.67 portfolio value and a list of his investments, next to the Your Portfolio screen",
                            title: "Home",
                            caption:
                                "The investor's portfolio value up top, with their investments and how each one is doing.",
                        },
                    ],
                },
                { kind: "heading", text: "The rest of the app" },
                {
                    kind: "text",
                    parts: [
                        "The rest of the team built the other flows: investing in a project, following its updates, voting on an offer to sell, and withdrawing funds.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Team flows",
                    shots: [
                        {
                            src: "/projects/3-stones/invest-crop.webp",
                            frame: "/projects/3-stones/invest-frame.webp",
                            width: 1200,
                            height: 749,
                            alt: "A project's image gallery of a residential complex, next to a Payment Successful receipt with the transaction ID, date and total",
                            title: "Invest",
                            caption: "A project's photos and plans, then a receipt once the investment goes through.",
                        },
                        {
                            src: "/projects/3-stones/updates-crop.webp",
                            frame: "/projects/3-stones/updates-frame.webp",
                            width: 1200,
                            height: 749,
                            alt: "A list of project updates, next to an update for 333 Market Street with a construction photo and the developer's contact details",
                            title: "Project updates",
                            caption: "Updates from the developer, each with photos and who to contact.",
                        },
                        {
                            src: "/projects/3-stones/vote-crop.webp",
                            frame: "/projects/3-stones/vote-frame.webp",
                            width: 1200,
                            height: 749,
                            alt: "A project page with a Vote Required banner, next to the Vote on Sale screen with the offer price, closing date and the developer's note",
                            title: "Vote on sale",
                            caption: "When a developer gets an offer, investors read the terms and vote on the sale.",
                        },
                        {
                            src: "/projects/3-stones/withdraw-crop.webp",
                            frame: "/projects/3-stones/withdraw-frame.webp",
                            width: 1200,
                            height: 749,
                            alt: "Three phones showing a profile with a connected Chase account, a withdrawal of $700 of available cash, and the pending transfer's details",
                            title: "Withdraw",
                            caption: "Move available cash to a connected bank and follow the pending transfer.",
                        },
                    ],
                },
            ],
        },
    },
];

/** Where a project's tile or button leads: its own page, its outside link, or nowhere. */
export const projectHref = (p: Project) => (p.page ? `/projects/${p.slug}` : p.link);

export const isExternal = (href: string) => /^https?:/.test(href);
