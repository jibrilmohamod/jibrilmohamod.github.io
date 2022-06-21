<template>
 <TheNav></TheNav>
 <div id="demo" class="h-screen border border-green-500"></div>
</template>

<script>
 import { Particle } from "jparticles"
 import TheNav from "../components/TheNav.vue"

 export default {
  mounted() {
   new Particle("#demo", {})
  },
  components: { TheNav },
 }
</script>
