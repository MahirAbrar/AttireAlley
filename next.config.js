/** @type {import('next').NextConfig} */
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
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
  webpack: (config) => {
    config.resolve.fallback = {
      "mongodb-client-encryption": false,
      aws4: false,
    };

    return config;
  },
};
