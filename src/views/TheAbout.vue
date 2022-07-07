<template>
 <div class="flex flex-col gap-8">
  <p class="text-sm md:text-base leading-relaxed slg:text-lg lg:leading-loose">
   I'm Jibril Mohamud, a Vue.js developer based in Nairobi, Kenya. I am
   specialising in Web Development with Vue.js, Express, PostgreSQL and Node.js.
  </p>
  <p class="text-sm md:text-base leading-relaxed slg:text-lg lg:leading-loose">
   I'm currently working for
   <LinkBtn link="https://parexellence.com/">Parexellence</LinkBtn>, a cool web
   development company in Nairobi. I recently worked on
   <LinkBtn link="https://dulaamotorscompany.com">Dulaa Motors</LinkBtn>, a
   website for a motor company located in Dubai.
  </p>
  <p class="text-sm md:text-base leading-relaxed slg:text-lg lg:leading-loose">
   I am a self taught developer and I am always looking for new challenges to
   learn new things.
  </p>
  <p class="text-sm md:text-base leading-relaxed slg:text-lg lg:leading-loose">
   You can find my projects on my
   <LinkBtn link="https://github.com/jibrilmohamod">Github</LinkBtn> or on my
   <LinkBtn link="/">Portfolio</LinkBtn> page. I usually don't update my
   portfolio page but all my recent one's are on github.
  </p>
  <p class="text-sm md:text-base leading-relaxed slg:text-lg lg:leading-loose">
   You can follow along about my life on my
   <LinkBtn link="https://twitter.com/mohamodjibril">Twitter</LinkBtn>. I post
   very rarely so you might not find many posts on either.
  </p>
  <hr class="bg-squgily bg-repeat border-0 h-[6px] opacity-25 my-6" />
  <div class="flex flex-col gap-5">
   <h3 class="font-theme_bold text-head_text text-3xl">Work</h3>
   <div class="flex flex-col gap-8 py-4">
    <a
     class="flex flex-col gap-1 sm:flex-row flex-nowrap justify-between items-start sm:gap-6"
     v-for="work in works"
     :key="work.id"
     :href="work.link"
    >
     <span class="font-theme_bold text-head_text">{{ work.name }}</span>
     <span class="flex-[1_1_auto]"></span>
     <span class="sm:text-right text-sm sm:text-base">{{ work.position }}</span>
     <span class="text-sm sm:text-base">{{ work.from }} - {{ work.to }}</span>
    </a>
   </div>
  </div>
 </div>
</template>
<script>
 import { useWorkStore } from "../store/workStore"

 export default {
  setup() {
   const workStore = useWorkStore()
   const works = workStore.getAllWorks

   return { works }
  },
 }
</script>
