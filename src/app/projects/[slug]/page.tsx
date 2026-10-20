import { notFound } from "next/navigation";
import { projects } from "../../data/projects";
import ProjectPage from "./project-page";

export const dynamicParams = false;

export function generateStaticParams() {
    return projects.filter((p) => p.page).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project?.page) return {};
    const { tagline, share } = project.page;
    return {
        // Share images need an absolute URL, so this page resolves them against the live site.
        metadataBase: new URL("https://www.daoho.dev"),
        title: project.name,
        description: tagline,
        openGraph: {
            title: project.name,
            description: tagline,
            ...(share && { images: [{ url: share, width: 1200, height: 630 }] }),
        },
        twitter: { card: "summary_large_image", title: project.name, description: tagline },
    };
}

export default function Page({ params }: { params: { slug: string } }) {
    const project = projects.find((p) => p.slug === params.slug && p.page);
    if (!project) notFound();
    return <ProjectPage slug={project.slug} />;
}
