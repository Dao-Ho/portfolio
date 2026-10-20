import type { ReactNode } from "react";

export const metadata = {
    title: "Blog",
};

export default function BlogLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
