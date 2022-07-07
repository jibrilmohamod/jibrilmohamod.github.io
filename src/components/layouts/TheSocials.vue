<template>
 <div class="flex justify-between items-center">
  <div class="flex gap-1">
   <SocialIcon
    title="Github"
    link="https://github.com/jibrilmohamod"
    icon="ant-design:github-filled"
   />
   <SocialIcon
    title="Twitter"
    link="https://twitter.com/MohamodJibril"
    icon="ant-design:twitter-outlined"
   />
  </div>
  <ActionButton link="mailto:jazimjibril@gmail.com">Email Me</ActionButton>
 </div>
</template>

<script>
 import SocialIcon from "../ui/SocialIcon.vue"
 import ActionButton from "../ui/ActionButton.vue"

 export default {
  components: { SocialIcon, ActionButton },
 }
</script>
