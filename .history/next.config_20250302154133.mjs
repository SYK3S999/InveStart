/** @type {import('next').NextConfig} */
const nextConfig = {
    // adding images.unsplash.com to the list of domains
    images: {
        domains: ['source.unsplash.com', 'images.unsplash.com'],
    },
};

export default nextConfig;
