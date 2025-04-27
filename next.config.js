/** @type {import('next').NextConfig} */
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      }
    ],
    domains: ['firebasestorage.googleapis.com', 'localhost'],
  },
  // webpack: (config, { dev, isServer }) => {
  //   const serverSideOrProd = isServer || !dev;
  //   if (!serverSideOrProd)
  //     config.plugins.push(
  //       new BrowserSyncPlugin(
  //         {
  //           host: "0.0.0.0",
  //           port: 4000,
  //           open: false,
  //           proxy: "http://localhost:3000/",
  //         },
  //         {
  //           reload: false,
  //           injectChanges: false,
  //         },
  //       ),
  //     );
  //   return config;
  // },
};

module.exports = nextConfig;
