<template>
 <TheNav></TheNav>
 <div class="h-[93vh] bg-black text-white">
  <article class="block ml-28 pt-32">
   <p class="text-5xl leading-loose">
    Hello, <br />
    I'm Jibril Mohamod <br />
    A passionate<span></span>
   </p>
   <p class="text-2xl leading-relaxed">
    Currently located in Nairobi, Kenya. <br />
    I love building interactive ,digital experiences on the web.
   </p>
  </article>

  <button class="ml-28 mt-24 border border-green-600">
   <a href="" class="mx-11 my-2 text-2xl inline-block">Get in Touch</a>
  </button>
  <div id="demo"></div>
 </div>
</template>

<script setup>
 import TheNav from "./TheNav.vue"
</script>

<style scoped>
 @import url("https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@400;500;600&display=swap");
 p {
  font-family: "Zilla Slab", serif;
 }
 span::before {
  content: "Developer";
  animation: animate infinite 10s;
  padding-left: 10px;
 }

 @keyframes animate {
  0% {
   content: "Frontend Web Developer";
  }

  50% {
   content: "Backend Web Developer";
  }

  75% {
   content: "Full Stack Web Developer";
  }
 }
</style>
