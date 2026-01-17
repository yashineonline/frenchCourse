export default {
  title: "French PR Accelerator",
  description: "Content-first French plan for PR language tests",
  // IMPORTANT for GitHub Project Pages:
  // base must be "/<REPO_NAME>/"
  base: "/frenchCourse/",
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
        { text: "Spanish Bridge", link: "/02-SPANISH-BRIDGE" }
      ]},
      { text: "Skills", items: [
        { text: "Pronunciation", link: "/03-PRONUNCIATION-A0-A2" },
        { text: "Grammar Ladder", link: "/04-CORE-GRAMMAR-A0-B2" },
        { text: "Input Ladder", link: "/05-INPUT-LADDER-A0-B2" },
        { text: "Output Templates", link: "/06-OUTPUT-TEMPLATES-SPEAKING-WRITING" }
      ]},
      { text: "Practice", items: [
        { text: "Canada Topics", link: "/07-CANADA-TOPICS-INTERVIEW-PRACTICE" },
        { text: "Tracker", link: "/08-TRACKER-8-WEEKS" },
        { text: "Build Checklist", link: "/09-2DAY-BUILD-CHECKLIST" },
        { text: "Speaking Prompts", link: "/10-PROMPTS-SPEAKING-60" },
        { text: "Writing Prompts", link: "/11-PROMPTS-WRITING-20" }
      ]}
    ]
  }
}
