import { defineConfig } from "vitepress";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // IMPORTANT: must match your repo name for GitHub Pages project sites
  base: "/frenchCourse/",
  title: "French PR Accelerator",
  description: "Content-first French plan for PR language tests",
  
  head: [
  ["meta", { property: "og:title", content: "French PR Accelerator" }],
  ["meta", { property: "og:description", content: "Free French course for Canadian PR (TEF/TCF oriented)" }],
  // ["meta", { property: "og:image", content: "/frenchCourse/og.png" }],
  ["meta", { property: "og:url", content: "https://yashineonline.github.io/frenchCourse/" }],
  ["meta", { name: "twitter:card", content: "summary_large_image" }]
],
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        
        // includeAssets: [
          // "favicon.ico",
          // "icons/pwa-192.png",
          // "icons/pwa-512.png",
         // "icons/apple-touch-icon.png",
          // "og.png"
        // ],
        manifest: {
          name: "French PR Accelerator",
          short_name: "French PR",
          description: "Learn French fast for Canadian PR language tests",
          start_url: "/frenchCourse/",
          scope: "/frenchCourse/",
          display: "standalone",
          theme_color: "#111827",
          background_color: "#111827",
          // icons: [
            // { src: "/frenchCourse/icons/pwa-192.png", sizes: "192x192", type: "image/png" },
            // { src: "/frenchCourse/icons/pwa-512.png", sizes: "512x512", type: "image/png" }
          // ]
        }
      })
    ]
  },
  themeConfig: {
    nav: [
      { text: "Start", link: "/00-START-TODAY-2H" },
      { text: "PR Targets", link: "/01-PR-TARGETS-TEF-TCF" },
      { text: "Prompts", link: "/10-PROMPTS-SPEAKING-60" }
    ],
    sidebar: [
      { text: "Start", items: [
        { text: "Home", link: "/" },
        { text: "Start Today", link: "/00-START-TODAY-2H" },
        { text: "PR Targets", link: "/01-PR-TARGETS-TEF-TCF" },
        { text: "Spanish Bridge", link: "/02-SPANISH-BRIDGE" },
        { text: "Study Plan (A0→B2)", link: "/12-STUDY-PLAN-A0-B2" },
        { text: "SRS + Anki Setup", link: "/13-ANKI-SRS-SETUP" }        
      ]
      },
      { text: "Skills", items: [
        { text: "Pronunciation", link: "/03-PRONUNCIATION-A0-A2" },
        { text: "Grammar Ladder", link: "/04-CORE-GRAMMAR-A0-B2" },
        { text: "Input Ladder", link: "/05-INPUT-LADDER-A0-B2" },
        { text: "Output Templates", link: "/06-OUTPUT-TEMPLATES-SPEAKING-WRITING" }
      ]
      },
      { text: "Practice", 
       items: [
        { text: "Canada Topics", link: "/07-CANADA-TOPICS-INTERVIEW-PRACTICE" },
        { text: "Tracker", link: "/08-TRACKER-8-WEEKS" },
        { text: "Exam Strategy & Mocks", link: "/09-EXAM-STRATEGY-MOCKS" },
        { text: "Speaking Prompts", link: "/10-PROMPTS-SPEAKING-60" },
        { text: "Writing Prompts", link: "/11-PROMPTS-WRITING-20" }
      ]
      }
    ]
  }
});


