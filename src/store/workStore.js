import { defineStore } from "pinia"

export const useWorkStore = defineStore("workStore", {
 state: () => ({
  works: [
   {
    id: 1,
    name: "Parexellence",
    position: "Jr. Frontend Developer",
    from: "2022",
    to: "Cur.",
    link: "https://Parexellence.com/",
   },
  ],
 }),
 getters: {
  getAllWorks: (state) => state.works,
 },
})
