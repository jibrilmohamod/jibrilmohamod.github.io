<template>
 <div class="flex flex-col gap-16 slg:gap-24">
  <div class="flex flex-col gap-5 slg:gap-12">
   <h1
    class="text-2xl sm:text-3xl md:text-4xl slg:text-5xl font-theme_bold text-head_text"
   >
    Projects<span class="text-link_text_hover">.</span>
   </h1>
   <p class="text-base slg:text-lg">
    Here are projects I've worked on in my past year of web development. Not all
    are great but they're in order of my experience.
   </p>
  </div>
  <hr class="bg-squgily bg-repeat border-0 h-[6px] opacity-25" />
  <div class="flex flex-col items-center justify-center gap-28">
   <MainProjectItem
    v-for="proj in projects"
    :key="proj.id"
    :name="proj.name"
    :image="proj.image"
    :description="proj.description"
    :link="proj.link"
   />
  </div>
  <hr class="bg-squgily bg-repeat border-0 h-[6px] opacity-25" />
 </div>
</template>

<script>
 import MainProjectItem from "../components/ui/MainProjectItem.vue"
 import { useProjectStore } from "../store/projectStore"

 export default {
  components: { MainProjectItem },
  setup() {
   const projectStore = useProjectStore()
   const projects = projectStore.getAllProjects
   const grave = projectStore.getGraveProjects

   return { projects, grave }
  },
 }
</script>
