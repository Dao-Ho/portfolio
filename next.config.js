/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // AVIF where the browser supports it (roughly 20–30% smaller than WebP for the same quality), WebP otherwise.
        formats: ["image/avif", "image/webp"],
        // Optimized images are cached for 31 days instead of the default 60 seconds, so repeat visits don't refetch.
        // Replacing an image means giving it a new filename.
        minimumCacheTTL: 2678400,
    },
};

module.exports = nextConfig;
