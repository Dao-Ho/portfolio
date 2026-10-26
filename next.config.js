/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // AVIF where the browser supports it (roughly 20–30% smaller than WebP for the same quality), WebP otherwise.
        formats: ["image/avif", "image/webp"],
        // Optimized images are cached for 31 days instead of the default 60 seconds, so repeat visits don't refetch.
        // Replacing an image means giving it a new filename.
        minimumCacheTTL: 2678400,
        // Next 16 only serves listed qualities; project pages request 90.
        qualities: [75, 90],
    },
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
