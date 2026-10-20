import { notFound } from "next/navigation";
import { projects } from "../../data/projects";
import ProjectPage from "./project-page";

export const dynamicParams = false;

export function generateStaticParams() {
    return projects.filter((p) => p.page).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
    const project = projects.find((p) => p.slug === params.slug);
    return project ? { title: project.name, description: project.page?.tagline } : {};
}

export default function Page({ params }: { params: { slug: string } }) {
    const project = projects.find((p) => p.slug === params.slug && p.page);
    if (!project) notFound();
    return <ProjectPage slug={project.slug} />;
}
