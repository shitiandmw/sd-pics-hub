<template>
  <phone-container class="relative">
    <div class=" mt-12 mx-auto">
      <div class=" text-center text-3xl text-gray-300">此处应该有一张宣传海报</div>
      <div class=" text-center text-3xl mt-28 leading-relaxed">只需3步<br>即可生成逼真AI写真<br>快去体验吧！</div>
    </div>
    <div class="absolute w-full bottom-8 flex items-center justify-center">
        <lbutton class="shadow-xl w-64" @click="goStep">去体验</lbutton>
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
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      step_index:0,
      show_login:false,
      pupup_index:0,
    };
  },
  onLoad() {},
  methods: {
   switchStep:function(index){
     this.step_index=index;
   },
   loginSuccess(){
    uni.navigateTo({
      url: '/pages/guide/step'
    });
   },
   registerSuccess(){
    uni.navigateTo({
      url: '/pages/guide/step'
    });
   },
   goStep(){
    if(!this.user) this.show_login = true;
    else uni.navigateTo({
      url: '/pages/guide/step'
    });
   }
  },
  computed: {
    ...mapState("user", ["user"]),
  },
  components:{ steps,lbutton ,lpopup ,login,register }
};
</script>

<style>
</style>
