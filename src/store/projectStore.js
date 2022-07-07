import { defineStore } from "pinia"

export const useProjectStore = defineStore("projectStore", {
 state: () => ({
  projects: [
   {
    id: 1,
    name: "Dulaa Motors",
    image: new URL("../assets/featured/scarlet_dyn.png", import.meta.url).href,
    description:
     "I made this website for a car dealer in Dubai. It was a simple project that I undertook during my time at Mount Kenya University.",
    tech: ["Vue.js", "Pinia", "TailwindCSS"],
    link: "https://dulaamotorscompany.com/",
    featured: true,
   },
   {
    id: 2,
    name: "Parexellence Landing Page",
    image: new URL("../assets/featured/portfolioprev.png", import.meta.url)
     .href,
    description:
     "This is a landing page for Parexellence. A marketing agency located in Nairobi,Kenya.",
    tech: ["Vue.js", "TailwindCSS"],
    link: "https://parexellence.com/",
   },
   {
    id: 3,
    name: "Stust - Fictional Card Designers",
    image: new URL("../assets/featured/stust.png", import.meta.url).href,
    description:
     "Stust is a made-up company which designs minimalistic card designs with high quality. This was a website made to practice Vue.js",
    tech: ["Vue.js", "TailwindCSS"],
    link: "https://stust.vercel.app/",
    featured: true,
   },
   {
    id: 4,
    name: "Parexellence University",
    image: new URL("../assets/featured/mikey.jpg", import.meta.url).href,
    description:
     "A university website for Parexellence. This was a concept project if you will.",
    tech: ["JS", "Node.js", "MongoDB", "Heroku"],
    link:
     "https://discord.com/oauth2/authorize?client_id=819239364395532370&permissions=3912576065&scope=bot%20applications.commands",
   },
   {
    id: 5,
    name: "Advice Generator",
    image: new URL("../assets/featured/advice-gen.png", import.meta.url).href,
    description:
     "A very simple Advice Generator, which gives advice with a click!",
    tech: ["HTML", "CSS", "JS", "REST APIs"],
    link: "https://advice-generator-ap.vercel.app/",
   },
  ],
  grave: [
   {
    id: 1,
    name: "Text Case Changer",
    image: new URL("../assets/featured/case_changer.jpg", import.meta.url).href,
    description: "A simple text case modifier to change case of text as need.",
    tech: ["Python", "Pandas"],
    link: "https://github.com/mightykillrr/case_changer",
   },
   {
    id: 2,
    name: "Tic Tac Toe",
    image: new URL("../assets/featured/tic_tac_toe.jpg", import.meta.url).href,
    description: "A game I made as a school project which I am very proud of.",
    tech: ["Python", "Pandas"],
    link: "https://github.com/mightykillrr/tic-tac-toe",
   },
   {
    id: 3,
    name: "Advanced Calculator",
    image: new URL("../assets/featured/calc.jpg", import.meta.url).href,
    description:
     "An advanced calculator and my first ever HUGE Python project.",
    tech: ["Python", "MathLib"],
    link: "https://github.com/mightykillrr/advanced_calc",
   },
  ],
 }),
 getters: {
  getAllProjects: (state) => state.projects,
  getFeaturedProjects: (state) =>
   state.projects.filter((project) => project.featured),
  getGraveProjects: (state) => state.grave,
 },
})
