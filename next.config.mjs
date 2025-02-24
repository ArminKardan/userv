/** @type {import('next').NextConfig} */

// const fs = require('fs');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
global.DEVMODE = process.env.DEVMODE?.toString()?.trim()?.toLowerCase()?.includes("true");
global.BUILDMODE = process.env.BUILDMODE?.toString()?.trim()?.toLowerCase() == "true";
global.nodeenv = process.env.NODE_ENV
global.devmode = global.DEVMODE || process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test"
// const path = require('path');

console.log("DEV MODE:",global.devmode )

import path from 'path'
const nextConfig = {
    // output: "standalone",
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    
    typescript: {
        ignoreBuildErrors: true,
    },

    images: {
        disableStaticImages: true,
        unoptimized: true,
    },


    webpack: (config, { isServer }) => {
        config.ignoreWarnings = [
          (warning) =>
            warning.message.includes('Critical'),
        ];

        // if (!isServer) {
        //     const packagePath = path.resolve(process.cwd(), 'node_modules', 'qecomps');
      
        //     config.watchOptions = {
        //       ignored: [
        //         '**/node_modules/!(qecomps/**',
        //       ],
        //     };
      
        //     config.resolve.alias = {
        //       ...config.resolve.alias,
        //       'qecomps': packagePath, 
        //     };
        //   }

    
        return config;
      },



    transpilePackages: ['qecomps'],


    // images: {
    //     minimumCacheTTL: 360000,
    //     domains:
    //         [
    //             process.env.DOMAIN,
    //             "gravatar.com",
    //             "qepal.com",
    //             'lh3.googleusercontent.com',
    //             "cdn0.qepal.com", "cdn1.qepal.com", "cdn2.qepal.com", "cdn3.qepal.com", "cdn4.qepal.com", "cdn5.qepal.com",
    //         ],
    // },

    rewrites: async () => {
        return [
            {
                source: '/robots.txt',
                destination: '/api/robots'
            },
            {
                source: '/cert/:path*',
                destination: '/api/cert/:path*'
            },
            {
                source: '/cl/:path*',
                destination: '/fa/workspace/challenge/:path*'
            },
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap'
            },
            {
                source: '/:lang(ch)/:path*',
                destination: '/en/:path*?lang=:lang',
            },
        ];
    },

    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|mp4|webp)',
                locale: false,
                headers: [
                    {
                        key: 'Cache-Control',
                        // value: 'public, max-age=0, must-revalidate',
                        value: 'public, max-age=9999999999, must-revalidate',
                    }
                ],
            },
            {
                source: '/:all*(oga|ogg)',
                locale: false,
                headers: [
                    {
                        key: 'content-type',
                        value: 'application/octet-stream',
                    }
                ],
            },
            {
                source: "/(.*?)",
                locale: false,
                headers: [
                    {
                        key: "referrerpolicy",
                        value: "no-referrer"
                    },
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true'
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: '*'
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: '*'
                    },
                ],
            },
        ]
    },
};


export default nextConfig;
