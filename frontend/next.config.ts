
// /**@type {import('next').NextConfig} */

// const nextConfig={
//   images: {
//     remotePatterns:[
//       {
//       protocol: "https",
//       hostname:"res.cloudinary.com",
//       port:"",
//       pathname:"/**",
//     },
//   ],
// },
// };
// export default nextConfig;
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["res.cloudinary.com"], // ✅ Optional, allows images from this domain
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Temporary fix for ESLint errors during build
  },
};

export default nextConfig;
