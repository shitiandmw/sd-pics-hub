<template>
  <phone-container class="relative">
    <div class="absolute w-full bottom-8">
        <lbutton class="shadow-xl w-64" @click="show_login = true">去体验</lbutton>
    </div>
    <lpopup v-model="show_login" class="">
        <div class="pb-6 pt-10 px-6">
          <login v-if="pupup_index==0" @success="loginSuccess" @goRegister="pupup_index=1"></login>
          <register v-else  @goLogin="pupup_index=0" @success="registerSuccess"></register>
        </div> 
    </lpopup>
  </phone-container>
</template>

<script>
import steps from './components/steps.vue';
import lbutton from '@/components/button.vue';
import lpopup from '@/components/popup.vue';
import login from '@/pages/components/login.vue';
import register from '@/pages/components/register.vue';
export default {
  data() {
    return {
      step_index:0,
      show_login:true,
      pupup_index:0,
    };
  },
  onLoad() {},
  methods: {
   switchStep:function(index){
     this.step_index=index;
   },
   loginSuccess(){},
   registerSuccess(){},
  },
  components:{ steps,lbutton ,lpopup ,login,register }
};
</script>

<style>
</style>
