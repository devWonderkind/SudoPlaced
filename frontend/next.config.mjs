/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This is the key setting
  // Optional: If your images aren't loading, you may need to disable the default loader
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
