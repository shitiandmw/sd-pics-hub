<template>
  <view class="phone-container p-0 px-6 pt-10">
    <login
      v-if="pupup_index == 0"
      @success="loginSuccess"
      @goRegister="pupup_index = 1"
    ></login>
    <register
      v-else
      @goLogin="pupup_index = 0"
      @success="registerSuccess"
    ></register>
  </view>
</template>

<script>
import lpopup from "@/components/popup.vue";
import login from "@/pages/components/login.vue";
import register from "@/pages/components/register.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      pupup_index: 0,
      title: "Hello",
      redirect: "",
    };
  },
  onLoad(option) {
    this.redirect = option.redirect;
    console.log("option", option);
  },
  methods: {
    loginSuccess(){
      this.goRedirect();
    },
    registerSuccess(){
      this.goRedirect();
    },
    goRedirect(){
      var pages = getCurrentPages();
      if(pages.length > 1)
        uni.navigateBack();
      else if(this.redirect && this.redirect.length > 0) {
        uni.reLaunch({
          url: this.redirect ,
        });
      }
      else uni.reLaunch({url:"/pages/tab/templates"});
      
    }
  },
  onShow() {
  },
  computed: {
  },
  components: { lpopup, login, register },
};
</script>

<style>
</style>
