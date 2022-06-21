<template>
 <div>
  <nav class="flex justify-around h-16 items-end text-white bg-black">
   <RouterLink to="/" class="text-2xl">Jibril Mohamod</RouterLink>
   <div class="flex justify-between">
    <RouterLink to="/about" class="px-4">About</RouterLink>
    <RouterLink to="/about" class="px-4">About</RouterLink>
    <RouterLink to="/about" class="px-4">About</RouterLink>
   </div>
  </nav>
 </div>
</template>

<script setup>
 import { RouterLink } from "vue-router"
</script>

<style lang="scss" scoped></style>
