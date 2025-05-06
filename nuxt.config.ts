// https://nuxt.com/docs/api/configuration/nuxt-config
import colors from "tailwindcss/colors";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/google-fonts",
    "@nuxt/icon",
    "@sidebase/nuxt-auth",
    "nuxt-rate-limit",
    "@nuxt/test-utils",
  ],
  rateLimit: {
    enabled: true,
    driver: { name: "memory" },
    // Define specific rules for routes
    routes: {
      "/api/users/register": {
        max: 10,
        interval: "hour",
        throwError: true,
      },
    },
  },
  nitro: {
    externals: {
      inline: [],
      external: ["@prisma/client"],
    },
  },
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser":
          "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    public: {
      authOrigin: process.env.AUTH_ORIGIN,
    },
  },
  auth: {
    baseURL: "http://localhost:3000/api/auth",
    provider: {
      type: "authjs",
    },
    globalAppMiddleware: {
      isEnabled: false,
    },
  },
  googleFonts: {
    families: {
      Manrope: {
        wght: [400, 500, 700],
      },
    },
    display: "swap",
    preconnect: true,
  },
});
