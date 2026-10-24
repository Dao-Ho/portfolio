/** @type {import('next').NextConfig} */
const nextConfig = {
    // Proxy PostHog through our own domain so ad blockers don't drop events.
    async rewrites() {
        return [
            { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
            { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
        ];
    },
    skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
