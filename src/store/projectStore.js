import { defineStore } from "pinia"

export const useProjectStore = defineStore("projectStore", {
 state: () => ({
  projects: [
   {
    id: 1,
    name: "ALX Group Project Slides",
    image: new URL("../assets/featured/alx.png", import.meta.url).href,
    description: "This is the slides of the ALX Foundation's Group Project",
    tech: ["Vue.js", "TailwindCSS"],
    link:
     "https://drive.google.com/file/d/1s6jDLpntxUiXP4qDFmJiW2XIgcXzO0Am/view",
    featured: true,
   },
   {
    id: 2,
    name: "Dulaa Motors",
    image: new URL("../assets/featured/Dulaa-Motors.png", import.meta.url).href,
    description:
     "I made this website for a car dealer in Dubai. It was a simple project that I undertook during my time at Mount Kenya University.",
    tech: ["Vue.js", "Strapi", "TailwindCSS"],
    link: "https://dulaamotorscompany.com/",
    featured: true,
   },

   {
    id: 3,
    name: "Parexellence University",
    image: new URL(
     "../assets/featured/Parexellence-Unversity.png",
     import.meta.url
    ).href,
    description:
     "A university website for Parexellence. This was a concept project if you will.",
    tech: ["JS", "Netlify", "CSS"],
    link: "https://paraexellence-university.netlify.app/",
   },
   {
    id: 4,
    name: "Fyllo Landing Page",
    image: new URL(
     "../assets/featured/Fylo-landing-page-with-two-column-layout.png",
     import.meta.url
    ).href,
    description:
     "This a landing page for Fyllo. It is a FrontendMentor's Challenge.",
    tech: ["HTML", "CSS"],
    link: "https://fyllolandingpage.netlify.app/#/",
   },
   {
    id: 5,
    name: "Advice Generator",
    image: new URL("../assets/featured/advice.png", import.meta.url).href,
    description:
     "A very simple Advice Generator, which gives advice with a click!",
    tech: ["HTML", "CSS", "JS", "REST APIs"],
    link: "https://advicegeneratorapi.netlify.app/",
   },
   {
    id: 6,
    name: "Pokemon Picker",
    image: new URL("../assets/featured/poke.png", import.meta.url).href,
    description:
     "A website that gives you a description of a pokemon with a click!",
    tech: ["HTML", "CSS", "JS", "REST APIs"],
    link: "https://pokemonpicker1.netlify.app/",
   },
   {
    id: 7,
    name: "Quran API",
    image: new URL("../assets/featured/quranapi.png", import.meta.url).href,
    description: "A simple app that fetches random verses from the Quran API.",
    tech: ["Vuejs", "REST APIs"],
    link: "https://quranapi.netlify.app/",
   },
  ],
  grave: [],
 }),
 getters: {
  getAllProjects: (state) => state.projects,
  getFeaturedProjects: (state) =>
   state.projects.filter((project) => project.featured),
  getGraveProjects: (state) => state.grave,
 },
})
